import os
import torch
import torch.nn.functional as F
from torch_geometric.data import DataLoader

from model import DepartmentGNN
from data_loader import graph_manager

def train_gnn(epochs=50, lr=0.01):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training GNN on {device}")
    
    # In a real scenario, this would load a batched list of historical 
    # grievance feature vectors and their actual correctly resolved departments (targets)
    # For now, we mock the training loop structure
    
    num_features = 10
    model = DepartmentGNN(in_channels=num_features, hidden_channels=32, out_channels=1).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=5e-4)
    
    # Mock data: 100 random grievances
    mock_data_list = []
    for _ in range(100):
        # random features
        x = torch.randn(graph_manager.num_nodes, num_features)
        # Random target department index to route to (0 to num_nodes-1)
        target_idx = torch.randint(0, graph_manager.num_nodes, (1,)).item()
        # Binary target vector: 1 for correct department, 0 for others
        y = torch.zeros(graph_manager.num_nodes, 1)
        y[target_idx] = 1.0
        
        data = graph_manager.get_pyg_data(x)
        data.y = y
        mock_data_list.append(data)
        
    loader = DataLoader(mock_data_list, batch_size=10, shuffle=True)
    
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for data in loader:
            data = data.to(device)
            optimizer.zero_grad()
            
            out = model(data.x, data.edge_index)
            # Binary Cross Entropy with Logits for multi-label or single-label node classification
            loss = F.binary_cross_entropy_with_logits(out, data.y)
            
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * data.num_graphs
            
        avg_loss = total_loss / len(mock_data_list)
        if epoch % 10 == 0:
            print(f"Epoch {epoch:03d}, Loss: {avg_loss:.4f}")
            
    os.makedirs("/app/models", exist_ok=True)
    save_path = "/app/models/department_gnn.pth"
    torch.save(model.state_dict(), save_path)
    print(f"GNN trained and saved to {save_path}")

if __name__ == "__main__":
    train_gnn()
