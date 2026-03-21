import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import models

from data_loader import DamageImageDataset

def train_model(data_dir: str, epochs: int = 15, batch_size: int = 32, learning_rate: float = 0.001):
    if not torch.cuda.is_available():
        raise RuntimeError("❌ CUDA is NOT available. Forceful GPU training requested but no GPU/Drivers found. "
                         "Please run 'pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126 --force-reinstall' "
                         "to fix your installation.")
    
    device = torch.device("cuda")
    print(f"🚀 FORCEFULLY training on device: {device} (RTX detected)")
    
    dataset = DamageImageDataset(data_dir)
    if len(dataset) == 0:
        print(f"No valid images found in {data_dir}. Ensure structure corresponds to 0_MINOR, 1_LOW, etc.")
        return
        
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 5)
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    
    best_loss = float('inf')
    patience_counter = 0
    patience_limit = 5
    
    # Path relative to script
    script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # ai-models/cv
    save_dir = os.path.join(script_dir, "models")
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "damage_classifier.pth")
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * inputs.size(0)
            
        epoch_loss = running_loss / len(train_dataset)
        
        model.eval()
        val_loss = 0.0
        correct = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                correct += torch.sum(preds == labels.data)
                
        val_epoch_loss = val_loss / len(val_dataset)
        val_acc = correct.double() / len(val_dataset)
        
        print(f"Epoch {epoch}/{epochs-1} - Train Loss: {epoch_loss:.4f} | Val Loss: {val_epoch_loss:.4f} | Val Acc: {val_acc:.4f}")
        
        if val_epoch_loss < best_loss:
            best_loss = val_epoch_loss
            patience_counter = 0
            torch.save(model.state_dict(), save_path)
            print(f"--> Saved best model checkpoint to {save_path}")
        else:
            patience_counter += 1
            if patience_counter >= patience_limit:
                print("Early stopping triggered.")
                break

if __name__ == "__main__":
    # Resolve data path relative to script location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # from ai-models/cv/src/training/trainer.py to ai-models/cv/data/train
    default_data = os.path.join(current_dir, "..", "..", "data", "train")
    
    DATA_ROOT = os.getenv("CV_DATA_ROOT", default_data)
    print(f"Data Root: {DATA_ROOT}")
    train_model(DATA_ROOT)
