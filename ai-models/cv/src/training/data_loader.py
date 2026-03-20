import os
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

class DamageImageDataset(Dataset):
    def __init__(self, root_dir: str, transform=None):
        """
        Args:
            root_dir (string): Directory with all the images.
                               Expects structure:
                               root_dir/
                                  0_MINOR/
                                  1_LOW/
                                  2_MODERATE/
                                  3_SEVERE/
                                  4_CRITICAL/
            transform (callable, optional): Optional transform to be applied
                on a sample.
        """
        self.root_dir = root_dir
        self.transform = transform or transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.image_paths = []
        self.labels = []
        
        # Load paths and labels based on directory names
        if os.path.exists(root_dir):
            for label_name in os.listdir(root_dir):
                label_dir = os.path.join(root_dir, label_name)
                if os.path.isdir(label_dir):
                    try:
                        # Expecting prefix like "0_MINOR"
                        label_idx = int(label_name.split("_")[0])
                        for frame in os.listdir(label_dir):
                            if frame.lower().endswith(('.png', '.jpg', '.jpeg')):
                                self.image_paths.append(os.path.join(label_dir, frame))
                                self.labels.append(label_idx)
                    except ValueError:
                        continue

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_name = self.image_paths[idx]
        image = Image.open(img_name).convert('RGB')
        label = self.labels[idx]

        if self.transform:
            image = self.transform(image)

        return image, label
