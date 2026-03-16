"""
Fabric Vision Transformer Model
Inspired by DeiT architecture for fabric classification
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import math
from typing import Optional, Tuple

from .config import FabricViTConfig


class FabricEmbeddings(nn.Module):
    """
    Construct the CLS token, position and patch embeddings for fabric images.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        # Patch embedding
        self.patch_embeddings = FabricPatchEmbeddings(config)
        
        # CLS token
        self.cls_token = nn.Parameter(torch.zeros(1, 1, config.hidden_size))
        
        # Position embeddings
        num_patches = self.patch_embeddings.num_patches
        self.position_embeddings = nn.Parameter(torch.zeros(1, num_patches + 1, config.hidden_size))
        
        # Dropout
        self.dropout = nn.Dropout(config.hidden_dropout_prob)
        
        # Initialize weights
        self._init_weights()
    
    def _init_weights(self):
        nn.init.trunc_normal_(self.position_embeddings, std=self.config.initializer_range)
        nn.init.trunc_normal_(self.cls_token, std=self.config.initializer_range)
    
    def forward(self, pixel_values: torch.Tensor) -> torch.Tensor:
        batch_size, num_channels, height, width = pixel_values.shape
        
        # Patch embeddings
        embeddings = self.patch_embeddings(pixel_values)
        
        # Add CLS token
        cls_tokens = self.cls_token.expand(batch_size, -1, -1)
        embeddings = torch.cat([cls_tokens, embeddings], dim=1)
        
        # Add position embeddings
        embeddings = embeddings + self.position_embeddings
        
        # Dropout
        embeddings = self.dropout(embeddings)
        
        return embeddings


class FabricPatchEmbeddings(nn.Module):
    """
    Image to Patch Embedding for fabric images.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        # Calculate number of patches
        self.num_patches = (config.image_size // config.patch_size) ** 2
        
        # Convolution for patch embedding
        self.projection = nn.Conv2d(
            config.num_channels, 
            config.hidden_size, 
            kernel_size=config.patch_size, 
            stride=config.patch_size
        )
        
    def forward(self, pixel_values: torch.Tensor) -> torch.Tensor:
        batch_size, num_channels, height, width = pixel_values.shape
        
        # Validate image size
        if height != self.config.image_size or width != self.config.image_size:
            raise ValueError(
                f"Input image size ({height}x{width}) doesn't match model image size ({self.config.image_size}x{self.config.image_size})"
            )
        
        # Project to patch embeddings
        embeddings = self.projection(pixel_values)  # (batch_size, hidden_size, patch_h, patch_w)
        
        # Flatten: (batch_size, hidden_size, num_patches)
        embeddings = embeddings.flatten(2).transpose(1, 2)
        
        return embeddings


class FabricSelfAttention(nn.Module):
    """
    Multi-head self-attention mechanism for fabric analysis.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        self.hidden_size = config.hidden_size
        self.num_attention_heads = config.num_attention_heads
        self.attention_head_size = self.hidden_size // self.num_attention_heads
        
        # Query, Key, Value projections
        self.query = nn.Linear(self.hidden_size, self.hidden_size)
        self.key = nn.Linear(self.hidden_size, self.hidden_size)
        self.value = nn.Linear(self.hidden_size, self.hidden_size)
        
        # Output projection
        self.dense = nn.Linear(self.hidden_size, self.hidden_size)
        
        # Dropout
        self.dropout = nn.Dropout(config.attention_probs_dropout_prob)
        
    def transpose_for_scores(self, x: torch.Tensor) -> torch.Tensor:
        new_x_shape = x.size()[:-1] + (self.num_attention_heads, self.attention_head_size)
        x = x.view(new_x_shape)
        return x.permute(0, 2, 1, 3)
    
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        # Get Q, K, V
        mixed_query_layer = self.query(hidden_states)
        mixed_key_layer = self.key(hidden_states)
        mixed_value_layer = self.value(hidden_states)
        
        # Transpose for multi-head attention
        query_layer = self.transpose_for_scores(mixed_query_layer)
        key_layer = self.transpose_for_scores(mixed_key_layer)
        value_layer = self.transpose_for_scores(mixed_value_layer)
        
        # Calculate attention scores
        attention_scores = torch.matmul(query_layer, key_layer.transpose(-1, -2))
        attention_scores = attention_scores / math.sqrt(self.attention_head_size)
        
        # Apply softmax
        attention_probs = F.softmax(attention_scores, dim=-1)
        attention_probs = self.dropout(attention_probs)
        
        # Apply attention to values
        context_layer = torch.matmul(attention_probs, value_layer)
        
        # Transpose back
        context_layer = context_layer.permute(0, 2, 1, 3).contiguous()
        new_context_layer_shape = context_layer.size()[:-2] + (self.hidden_size,)
        context_layer = context_layer.view(new_context_layer_shape)
        
        # Output projection
        output = self.dense(context_layer)
        
        return output


class FabricSelfOutput(nn.Module):
    """
    Output projection for self-attention.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.dense = nn.Linear(config.hidden_size, config.hidden_size)
        self.dropout = nn.Dropout(config.hidden_dropout_prob)
        
    def forward(self, hidden_states: torch.Tensor, input_tensor: torch.Tensor) -> torch.Tensor:
        hidden_states = self.dense(hidden_states)
        hidden_states = self.dropout(hidden_states)
        hidden_states = hidden_states + input_tensor  # Residual connection
        return hidden_states


class FabricAttention(nn.Module):
    """
    Complete attention block with self-attention and output.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.attention = FabricSelfAttention(config)
        self.output = FabricSelfOutput(config)
        self.LayerNorm = nn.LayerNorm(config.hidden_size, eps=config.layer_norm_eps)
        
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        # Self-attention
        attention_output = self.attention(hidden_states)
        
        # Layer norm and residual
        attention_output = self.LayerNorm(attention_output + hidden_states)
        
        return attention_output


class FabricIntermediate(nn.Module):
    """
    Feed-forward network.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.dense = nn.Linear(config.hidden_size, config.intermediate_size)
        self.intermediate_act_fn = nn.GELU()
        
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        hidden_states = self.dense(hidden_states)
        hidden_states = self.intermediate_act_fn(hidden_states)
        return hidden_states


class FabricOutput(nn.Module):
    """
    Output projection for feed-forward network.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.dense = nn.Linear(config.intermediate_size, config.hidden_size)
        self.dropout = nn.Dropout(config.hidden_dropout_prob)
        
    def forward(self, hidden_states: torch.Tensor, input_tensor: torch.Tensor) -> torch.Tensor:
        hidden_states = self.dense(hidden_states)
        hidden_states = self.dropout(hidden_states)
        hidden_states = hidden_states + input_tensor  # Residual connection
        return hidden_states


class FabricLayer(nn.Module):
    """
    Complete Transformer layer for fabric analysis.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.attention = FabricAttention(config)
        self.intermediate = FabricIntermediate(config)
        self.output = FabricOutput(config)
        self.LayerNorm = nn.LayerNorm(config.hidden_size, eps=config.layer_norm_eps)
        
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        # Self-attention
        attention_output = self.attention(hidden_states)
        
        # Feed-forward
        intermediate_output = self.intermediate(attention_output)
        layer_output = self.output(intermediate_output, attention_output)
        
        # Layer norm and residual
        layer_output = self.LayerNorm(layer_output + attention_output)
        
        return layer_output


class FabricViTEncoder(nn.Module):
    """
    Stack of Transformer layers for fabric classification.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        self.layer = nn.ModuleList([FabricLayer(config) for _ in range(config.num_hidden_layers)])
        
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        for layer_module in self.layer:
            hidden_states = layer_module(hidden_states)
        return hidden_states


class FabricViTModel(nn.Module):
    """
    Complete Fabric Vision Transformer model.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        # Embeddings
        self.embeddings = FabricEmbeddings(config)
        
        # Encoder
        self.encoder = FabricViTEncoder(config)
        
        # Initialize weights
        self.post_init()
    
    def post_init(self):
        """Initialize weights"""
        self.apply(self._init_weights)
    
    def _init_weights(self, module):
        """Initialize weights"""
        if isinstance(module, nn.Linear):
            nn.init.trunc_normal_(module.weight, std=self.config.initializer_range)
            if module.bias is not None:
                nn.init.constant_(module.bias, 0)
        elif isinstance(module, nn.LayerNorm):
            nn.init.constant_(module.bias, 0)
            nn.init.constant_(module.weight, 1.0)
    
    def forward(self, pixel_values: torch.Tensor) -> torch.Tensor:
        # Embeddings
        embedding_output = self.embeddings(pixel_values)
        
        # Encoder
        sequence_output = self.encoder(embedding_output)
        
        # Return CLS token output
        cls_token_output = sequence_output[:, 0, :]
        
        return cls_token_output


class FabricViTClassifier(nn.Module):
    """
    Fabric classification head.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        # Classification head
        self.classifier = nn.Linear(config.hidden_size, config.num_fabric_classes)
        
    def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
        logits = self.classifier(hidden_states)
        return logits


class FabricViTForClassification(nn.Module):
    """
    Complete Fabric Vision Transformer for classification.
    """
    
    def __init__(self, config: FabricViTConfig):
        super().__init__()
        self.config = config
        
        # Vision Transformer
        self.vit = FabricViTModel(config)
        
        # Classification head
        self.classifier = FabricViTClassifier(config)
        
        # Initialize weights
        self.post_init()
    
    def post_init(self):
        """Initialize weights"""
        self.vit.post_init()
        self.classifier.apply(self._init_weights)
    
    def _init_weights(self, module):
        """Initialize weights"""
        if isinstance(module, nn.Linear):
            nn.init.trunc_normal_(module.weight, std=self.config.initializer_range)
            if module.bias is not None:
                nn.init.constant_(module.bias, 0)
    
    def forward(self, pixel_values: torch.Tensor) -> torch.Tensor:
        # Get CLS token output
        cls_token_output = self.vit(pixel_values)
        
        # Classification
        logits = self.classifier(cls_token_output)
        
        return logits
    
    def predict(self, pixel_values: torch.Tensor) -> dict:
        """
        Predict fabric class with confidence.
        
        Args:
            pixel_values: Input image tensor (batch_size, 3, 224, 224)
            
        Returns:
            dict: {
                'predicted_class': str,
                'confidence': float,
                'class_probabilities': dict,
                'logits': torch.Tensor
            }
        """
        self.eval()
        with torch.no_grad():
            logits = self.forward(pixel_values)
            
            # Apply softmax to get probabilities
            probabilities = F.softmax(logits, dim=-1)
            
            # Get predicted class and confidence
            predicted_class_idx = torch.argmax(probabilities, dim=-1)
            confidence = torch.max(probabilities, dim=-1)[0]
            
            # Convert to class names
            predicted_class = self.config.fabric_classes[predicted_class_idx.item()]
            
            # Get all class probabilities
            class_probabilities = {
                class_name: prob.item() 
                for class_name, prob in zip(self.config.fabric_classes, probabilities[0])
            }
            
            return {
                'predicted_class': predicted_class,
                'confidence': confidence.item(),
                'class_probabilities': class_probabilities,
                'logits': logits[0]
            }
