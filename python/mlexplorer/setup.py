import setuptools

setuptools.setup(
    name="mlexplorer", # Replace with your own username
    version="0.0.1",
    author="John Fantell",
    author_email="admin@dolphindatallc.com",
    description="A Python API to interface with the open source ML Explorer platform",
    url="https://github.com/jfantell/mlexplorer",
    project_urls={
        'Issue Tracker': 'https://github.com/jfantell/mlexplorer/issues',
    },
    packages=setuptools.find_packages("src"),
    package_dir={"": "src"},
    classifiers=[
        "Programming Language :: Python :: 3",
    ],
    python_requires='>=3.4',
    install_requires=['requests','tensorflow']
)