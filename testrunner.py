# testrunner.py (updated)
import os
import unittest
from unittest import TextTestRunner

import debugpy  # type: ignore

if os.getenv("ENABLE_DEBUG") == "true":
    debugpy.listen(("0.0.0.0", 5679))
    print("Waiting for debugger to attach...")
    debugpy.wait_for_client()

if __name__ == "__main__":
    # Discover and run tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover(start_dir="tests", pattern="test_*.py")
    # Generate a text report
    with open("test-report.txt", "w") as output:
        test_runner = TextTestRunner(verbosity=2, stream=output)
        test_runner.run(test_suite)

    print("Test report saved as 'test-report.txt'.")
