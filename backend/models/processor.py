"""
Fabric Vision Transformer Image Processor
Handles image preprocessing for fabric classification
"""

import torch
import torch.nn.functional as F
from PIL import Image
import numpy as np
from typing import Union, List, Optional
from .config import FabricViTConfig


class FabricImageProcessor:
    """
    Image processor for fabric classification.
    Handles image loading, resizing, normalization, and tensor conversion.
    """
    
    def __init__(self, config: FabricViTConfig):
        self.config = config
        self.image_size = config.image_size
        self.patch_size = config.patch_size
        
        # ImageNet normalization (standard for Vision Transformers)
        self.mean = [0.485, 0.456, 0.406]
        self.std = [0.229, 0.224, 0.225]
        
    def resize_image(self, image: Image.Image) -> Image.Image:
        """
        Resize image to model input size while maintaining aspect ratio.
        """
        # Calculate aspect ratio
        original_width, original_height = image.size
        aspect_ratio = original_width / original_height
        
        # Calculate new dimensions
        if aspect_ratio > 1:
            # Landscape image
            new_width = self.image_size
            new_height = int(self.image_size / aspect_ratio)
        else:
            # Portrait image
            new_height = self.image_size
            new_width = int(self.image_size * aspect_ratio)
        
        # Resize image
        resized_image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        return resized_image
    
    def center_crop(self, image: Image.Image) -> Image.Image:
        """
        Center crop image to square dimensions.
        """
        width, height = image.size
        
        # Calculate crop dimensions
        if width < height:
            # Portrait - crop height
            left = 0
            top = (height - width) // 2
            right = width
            bottom = top + width
        else:
            # Landscape - crop width
            left = (width - height) // 2
            top = 0
            right = left + height
            bottom = height
        
        # Crop image
        cropped_image = image.crop((left, top, right, bottom))
        
        return cropped_image
    
    def normalize_image(self, image_tensor: torch.Tensor) -> torch.Tensor:
        """
        Normalize image tensor using ImageNet statistics.
        """
        # Convert to float and normalize to [0, 1]
        image_tensor = image_tensor.float() / 255.0
        
        # Apply normalization
        mean = torch.tensor(self.mean).view(1, 3, 1, 1)
        std = torch.tensor(self.std).view(1, 3, 1, 1)
        
        normalized_tensor = (image_tensor - mean) / std
        
        return normalized_tensor
    
    def load_image(self, image_path: str) -> Image.Image:
        """
        Load image from file path.
        """
        try:
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            return image
            
        except Exception as e:
            raise ValueError(f"Failed to load image from {image_path}: {str(e)}")
    
    def process_image(self, image: Union[Image.Image, str, np.ndarray]) -> torch.Tensor:
        """
        Process image for model input.
        
        Args:
            image: PIL Image, file path, or numpy array
            
        Returns:
            torch.Tensor: Processed image tensor (1, 3, image_size, image_size)
        """
        # Load image if path provided
        if isinstance(image, str):
            image = self.load_image(image)
        
        # Convert numpy array to PIL Image
        elif isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        # Ensure PIL Image
        if not isinstance(image, Image.Image):
            raise ValueError("Input must be PIL Image, file path, or numpy array")
        
        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize and crop
        image = self.resize_image(image)
        image = self.center_crop(image)
        
        # Convert to tensor
        image_tensor = torch.from_numpy(np.array(image)).permute(2, 0, 1).unsqueeze(0)
        
        # Normalize
        image_tensor = self.normalize_image(image_tensor)
        
        return image_tensor
    
    def process_batch(self, images: List[Union[Image.Image, str, np.ndarray]]) -> torch.Tensor:
        """
        Process batch of images for model input.
        
        Args:
            images: List of PIL Images, file paths, or numpy arrays
            
        Returns:
            torch.Tensor: Processed image tensor (batch_size, 3, image_size, image_size)
        """
        batch_tensors = []
        
        for image in images:
            processed_tensor = self.process_image(image)
            batch_tensors.append(processed_tensor.squeeze(0))  # Remove batch dimension
        
        # Stack into batch
        batch_tensor = torch.stack(batch_tensors, dim=0)
        
        return batch_tensor
    
    def preprocess_for_training(self, images: List[Union[Image.Image, str, np.ndarray]], 
                              labels: Optional[List[int]] = None) -> dict:
        """
        Preprocess images for training with optional data augmentation.
        
        Args:
            images: List of images
            labels: Optional list of labels
            
        Returns:
            dict: Processed images and labels
        """
        # Process images
        processed_images = self.process_batch(images)
        
        result = {'pixel_values': processed_images}
        
        if labels is not None:
            result['labels'] = torch.tensor(labels, dtype=torch.long)
        
        return result
