# LMCST Learn Sandboxes

This directory contains the Dockerfiles for building isolated language execution environments.

## How to build

Run the following commands to build the images. The backend expects these exact image names.

```bash
docker build -t lmcst-sandbox-python ./python
docker build -t lmcst-sandbox-cpp ./cpp
docker build -t lmcst-sandbox-c ./c
docker build -t lmcst-sandbox-java ./java
docker build -t lmcst-sandbox-javascript ./javascript
```

## Security

Containers are run with:
- No network access (`--network none`)
- Memory limit (`-m 128m` or `256m` for JVM)
- CPU limit (`--cpus 0.5`)
- Strict timeouts (~5-10s)
