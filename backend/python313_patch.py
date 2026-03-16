"""
Python 3.13 compatibility patch for Pydantic v1
"""
import sys
from typing import ForwardRef

# Check if we're on Python 3.13+
if sys.version_info >= (3, 13):
    # Store the original method
    original_evaluate = ForwardRef._evaluate

    # Create a patched version that handles the new signature
    def patched_evaluate(self, globalns=None, localns=None, *args, **kwargs):
        # Python 3.13+ requires recursive_guard parameter as keyword-only
        # If recursive_guard is not provided, add it
        if 'recursive_guard' not in kwargs:
            kwargs['recursive_guard'] = set()

        # Call the original method with the correct signature
        return original_evaluate(self, globalns, localns, *args, **kwargs)

    # Apply the patch
    ForwardRef._evaluate = patched_evaluate
    print("Applied Python 3.13 ForwardRef compatibility patch")