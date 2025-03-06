import unittest, os
from unittest import TextTestRunner
import coverage

if os.getenv("ENABLE_DEBUG") == "true":
    import debugpy
    # Set up the debugger
    debugpy.listen(("0.0.0.0", 5679))  # Replace 5678 with your preferred port
    print("Waiting for debugger to attach...")
    debugpy.wait_for_client()  # Wait for the debugger to attach

# Start coverage measurement
cov = coverage.Coverage()
cov.start()

# Discover and run tests
if __name__ == "__main__":
    # Run the unit tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover(start_dir='tests', pattern='test_*.py')  # Adjust start_dir as needed
    # Run tests with XMLTestRunner to generate a JUnit-style XML report
    # Run tests with TextTestRunner (no XML reporting)
    with open("test-report.txt", "w") as output:  # Change output file to .txt
        test_runner = TextTestRunner(verbosity=2, stream=output)
        test_runner.run(test_suite)

    # Stop coverage measurement
    cov.stop()
    cov.save()

    # Generate an HTML coverage report
    cov.html_report(directory="htmlcov")
    print("Test report saved as 'test-report.txt'.")
    print("HTML coverage report generated in the 'htmlcov' directory.")

# run these commands to copy reports from docker container to host    
# docker cp nextrealm_test_container:/app/test-report.txt ./test-report.txt
# docker cp nextrealm_test_container:/app/htmlcov ./htmlcov
