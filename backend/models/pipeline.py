"""
Fabric Classification Pipeline
Complete pipeline for fabric image classification using Vision Transformer
"""

import torch
import numpy as np
from PIL import Image
from typing import Union, List, Optional, Dict, Any
import logging

from .config import FabricViTConfig
from .model import FabricViTForClassification
from .processor import FabricImageProcessor


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FabricClassifier:
    """
    Complete fabric classification pipeline.
    Inspired by Hugging Face Transformers pipeline architecture.
    """
    
    def __init__(self, config: Optional[FabricViTConfig] = None, model_path: Optional[str] = None):
        """
        Initialize fabric classifier.
        
        Args:
            config: Model configuration
            model_path: Path to saved model weights
        """
        # Load or create config
        if config is None:
            self.config = FabricViTConfig()
        else:
            self.config = config
        
        # Initialize model
        self.model = FabricViTForClassification(self.config)
        
        # Initialize processor
        self.processor = FabricImageProcessor(self.config)
        
        # Load model weights if provided
        if model_path:
            self.load_model(model_path)
        
        # Set device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        logger.info(f"FabricClassifier initialized on {self.device}")
        logger.info(f"Model config: {self.config.to_dict()}")
    
    def load_model(self, model_path: str):
        """
        Load model weights from file.
        
        Args:
            model_path: Path to model weights file
        """
        try:
            checkpoint = torch.load(model_path, map_location='cpu')
            
            # Handle different checkpoint formats
            if 'model_state_dict' in checkpoint:
                self.model.load_state_dict(checkpoint['model_state_dict'])
            elif 'state_dict' in checkpoint:
                self.model.load_state_dict(checkpoint['state_dict'])
            else:
                self.model.load_state_dict(checkpoint)
            
            logger.info(f"Model loaded from {model_path}")
            
        except Exception as e:
            logger.error(f"Failed to load model from {model_path}: {str(e)}")
            raise
    
    def save_model(self, save_path: str, include_config: bool = True):
        """
        Save model weights and optionally config.
        
        Args:
            save_path: Path to save model
            include_config: Whether to include config in checkpoint
        """
        checkpoint = {
            'model_state_dict': self.model.state_dict(),
        }
        
        if include_config:
            checkpoint['config'] = self.config.to_dict()
        
        torch.save(checkpoint, save_path)
        logger.info(f"Model saved to {save_path}")
    
    def preprocess_image(self, image: Union[Image.Image, str, np.ndarray, bytes]) -> torch.Tensor:
        """
        Preprocess image for classification.
        
        Args:
            image: Input image (PIL Image, file path, numpy array, or bytes)
            
        Returns:
            torch.Tensor: Preprocessed image tensor
        """
        # Handle bytes input
        if isinstance(image, bytes):
            image = Image.open(io.BytesIO(image))
        
        # Process image
        pixel_values = self.processor.process_image(image)
        
        # Move to device
        pixel_values = pixel_values.to(self.device)
        
        return pixel_values
    
    def predict(self, image: Union[Image.Image, str, np.ndarray, bytes], 
                return_probabilities: bool = True) -> Dict[str, Any]:
        """
        Classify fabric image.
        
        Args:
            image: Input image
            return_probabilities: Whether to return class probabilities
            
        Returns:
            dict: Classification results
        """
        self.model.eval()
        
        with torch.no_grad():
            # Preprocess image
            pixel_values = self.preprocess_image(image)
            
            # Get prediction
            result = self.model.predict(pixel_values)
            
            # Prepare output
            output = {
                'predicted_class': result['predicted_class'],
                'confidence': result['confidence'],
            }
            
            if return_probabilities:
                output['class_probabilities'] = result['class_probabilities']
            
            return output
    
    def predict_batch(self, images: List[Union[Image.Image, str, np.ndarray]], 
                     return_probabilities: bool = True) -> List[Dict[str, Any]]:
        """
        Classify batch of fabric images.
        
        Args:
            images: List of input images
            return_probabilities: Whether to return class probabilities
            
        Returns:
            List[dict]: Classification results for each image
        """
        self.model.eval()
        
        with torch.no_grad():
            # Process batch
            pixel_values = self.processor.process_batch(images)
            pixel_values = pixel_values.to(self.device)
            
            # Get predictions
            logits = self.model(pixel_values)
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            
            # Prepare results
            results = []
            for i in range(len(images)):
                predicted_class_idx = torch.argmax(probabilities[i]).item()
                confidence = torch.max(probabilities[i]).item()
                predicted_class = self.config.fabric_classes[predicted_class_idx]
                
                result = {
                    'predicted_class': predicted_class,
                    'confidence': confidence,
                }
                
                if return_probabilities:
                    class_probs = {
                        class_name: prob.item() 
                        for class_name, prob in zip(self.config.fabric_classes, probabilities[i])
                    }
                    result['class_probabilities'] = class_probs
                
                results.append(result)
            
            return results
    
    def get_fabric_info(self, fabric_class: str) -> Dict[str, Any]:
        """
        Get fabric information for classification result.
        
        Args:
            fabric_class: Predicted fabric class
            
        Returns:
            dict: Fabric information
        """
        fabric_info = {
            'cotton': {
                'material': 'Cotton',
                'recyclable': True,
                'biodegradable': True,
                'guidance': 'Compost or donate for textile recycling',
                'tips': [
                    'Wash in cold water to reduce energy consumption',
                    'Line dry instead of using dryer',
                    'Consider donating usable cotton clothing',
                    'Compost worn-out cotton items'
                ],
                'environmental_impact': 'Cotton is natural and biodegradable but requires significant water to produce.'
            },
            'polyester': {
                'material': 'Polyester',
                'recyclable': True,
                'biodegradable': False,
                'guidance': 'Take to textile recycling centers or specialized facilities',
                'tips': [
                    'Check local recycling programs for polyester',
                    'Consider upcycling into new items',
                    'Avoid microfiber shedding during washing',
                    'Use mesh laundry bags to reduce microplastic pollution'
                ],
                'environmental_impact': 'Polyester is synthetic and not biodegradable but can be recycled into new fibers.'
            },
            'wool': {
                'material': 'Wool',
                'recyclable': True,
                'biodegradable': True,
                'guidance': 'Donate or compost for natural fiber decomposition',
                'tips': [
                    'Hand wash or use gentle cycle',
                    'Air dry to maintain fiber quality',
                    'Donate wool items to charity',
                    'Compost worn-out wool items'
                ],
                'environmental_impact': 'Wool is renewable and biodegradable with natural temperature regulation properties.'
            },
            'silk': {
                'material': 'Silk',
                'recyclable': True,
                'biodegradable': True,
                'guidance': 'Specialized textile recycling or composting',
                'tips': [
                    'Dry clean or hand wash gently',
                    'Store properly to prevent damage',
                    'Consider resale due to high value',
                    'Compost when no longer usable'
                ],
                'environmental_impact': 'Silk is a luxury natural fiber that is biodegradable but requires specialized processing.'
            },
            'linen': {
                'material': 'Linen',
                'recyclable': True,
                'biodegradable': True,
                'guidance': 'Mechanical recycling into linen fibers or composting',
                'tips': [
                    'Wash in cool water',
                    'Air dry to prevent shrinkage',
                    'Donate usable linen items',
                    'Compost worn-out linen fabrics'
                ],
                'environmental_impact': 'Linen is a natural fiber that can be effectively recycled through various methods.'
            },
            'nylon': {
                'material': 'Nylon',
                'recyclable': True,
                'biodegradable': False,
                'guidance': 'Specialized recycling facilities for synthetic fibers',
                'tips': [
                    'Check for nylon recycling programs',
                    'Avoid washing with hot water',
                    'Consider upcycling into new products',
                    'Use proper disposal methods'
                ],
                'environmental_impact': 'Nylon is durable and recyclable but contributes to microplastic pollution.'
            },
            'rayon': {
                'material': 'Rayon',
                'recyclable': False,
                'biodegradable': True,
                'guidance': 'Compost or dispose in textile waste',
                'tips': [
                    'Dry clean or hand wash gently',
                    'Avoid high heat drying',
                    'Consider donation if in good condition',
                    'Compost when no longer usable'
                ],
                'environmental_impact': 'Rayon is semi-synthetic and biodegradable but difficult to recycle effectively.'
            }
        }
        
        return fabric_info.get(fabric_class, {
            'material': fabric_class.capitalize(),
            'recyclable': False,
            'biodegradable': False,
            'guidance': 'Check local recycling options',
            'tips': [
                'Check fabric care labels before washing',
                'Consider donating usable fabrics',
                'Research local recycling options'
            ],
            'environmental_impact': f'{fabric_class.capitalize()} requires specialized disposal methods.'
        })
    
    def classify_fabric(self, image: Union[Image.Image, str, np.ndarray, bytes]) -> Dict[str, Any]:
        """
        Complete fabric classification with detailed information.
        
        Args:
            image: Input image
            
        Returns:
            dict: Complete classification result
        """
        # Get prediction
        prediction = self.predict(image, return_probabilities=True)
        
        # Get fabric information
        fabric_info = self.get_fabric_info(prediction['predicted_class'])
        
        # Combine results
        result = {
            'material': fabric_info['material'],
            'confidence': prediction['confidence'],
            'recyclable': fabric_info['recyclable'],
            'biodegradable': fabric_info['biodegradable'],
            'guidance': fabric_info['guidance'],
            'tips': fabric_info['tips'],
            'environmental_impact': fabric_info['environmental_impact'],
            'class_probabilities': prediction['class_probabilities']
        }
        
        return result


# Convenience function for quick classification
def classify_fabric_image(image: Union[Image.Image, str, np.ndarray, bytes], 
                         model_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Quick fabric classification function.
    
    Args:
        image: Input image
        model_path: Path to saved model (optional)
        
    Returns:
        dict: Classification result
    """
    classifier = FabricClassifier(model_path=model_path)
    return classifier.classify_fabric(image)
