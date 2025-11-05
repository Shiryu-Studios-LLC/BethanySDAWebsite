#!/bin/bash
set -e

echo "Installing .NET 9.0 SDK..."

# Download and install .NET 9.0 SDK
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 9.0.100 --install-dir ~/.dotnet

# Add dotnet to PATH
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools

# Verify installation
dotnet --version

echo "Building Blazor WebAssembly project..."
cd BethanyWebsite.Client
dotnet publish -c Release

echo "Build complete!"
