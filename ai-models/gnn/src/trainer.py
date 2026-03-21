import os
import torch
import torch.nn.functional as F
from torch_geometric.data import DataLoader

from model import DepartmentGNN
from data_loader import graph_manager

def train_gnn(epochs=50, lr=0.01):
    if not torch.cuda.is_available():
        raise RuntimeError("❌ CUDA is NOT available for GNN training. "
                         "Run 'pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126 --force-reinstall'")
    
    device = torch.device("cuda")
    print(f"🚀 FORCEFULLY training GNN on {device}")
    
    # Resolve relative path to data
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "..", "data", "preprocessed_311.pt")
    
    if not os.path.exists(data_path):
        print(f"Preprocessed data not found at {data_path}. Run preprocess_311.py first.")
        return
        
    print(f"Loading data from {data_path}...")
    processed_data = torch.load(data_path)
    features = processed_data["features"]
    targets = processed_data["targets"]
    
    num_features = features.size(1)
    model = DepartmentGNN(in_channels=num_features, hidden_channels=32, out_channels=1).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=5e-4)
    
    data_list = []
    print(f"Creating PyG graphs for {len(targets)} samples...")
    for i in range(len(targets)):
        y = torch.zeros(graph_manager.num_nodes, 1)
        target_idx = targets[i].item()
        
        # Defensive check against invalid indices
        if 0 <= target_idx < graph_manager.num_nodes:
            y[target_idx] = 1.0
        else:
            # Skip invalid samples (e.g. from mismatched preprocessing)
            continue
            
        x = features[i].unsqueeze(0).repeat(graph_manager.num_nodes, 1)
        data = graph_manager.get_pyg_data(x)
        data.y = y
        data_list.append(data)
        
    loader = DataLoader(data_list, batch_size=32, shuffle=True)
    
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for data in loader:
            data = data.to(device)
            optimizer.zero_grad()
            out = model(data.x, data.edge_index)
            loss = F.binary_cross_entropy_with_logits(out, data.y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * data.num_graphs
            
        avg_loss = total_loss / len(data_list)
        if epoch % 5 == 0:
            print(f"Epoch {epoch:03d}, Loss: {avg_loss:.4f}")
            
    save_dir = os.path.join(current_dir, "..", "models")
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "department_gnn.pth")
    torch.save(model.state_dict(), save_path)
    print(f"GNN trained on REAL data and saved to {save_path}")

if __name__ == "__main__":
    train_gnn()
