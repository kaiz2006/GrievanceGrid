import logging

logger = logging.getLogger(__name__)

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from torch_geometric.nn import GATConv
    HAS_PYG = True
except ImportError:
    HAS_PYG = False
    logger.warning("torch_geometric not installed.")

class DepartmentGNN(nn.Module if HAS_PYG else object):
    def __init__(self, in_channels, hidden_channels, out_channels, heads=2):
        super().__init__()
        if not HAS_PYG:
            return
            
        self.conv1 = GATConv(in_channels, hidden_channels, heads=heads, dropout=0.6)
        # On the GatConv output, the hidden dimension is multiplied by number of heads
        self.conv2 = GATConv(hidden_channels * heads, out_channels, heads=1, concat=False, dropout=0.6)

    def forward(self, x, edge_index):
        if not HAS_PYG:
            return x
            
        x = F.dropout(x, p=0.6, training=self.training)
        x = F.elu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.6, training=self.training)
        x = self.conv2(x, edge_index)
        
        # Return raw logits representing scores for each department node
        return x
