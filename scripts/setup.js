const { execSync } = require('child_process');
const path = require('path');

function executeCommand(command, cwd) {
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

// Get absolute paths
const rootDir = path.resolve(__dirname, '..');
const exampleDir = path.resolve(rootDir, 'example');

console.log('🔧 Setting up development environment...');

// Create npm link in root first
console.log('\n🔗 Creating package link...');
executeCommand('npm link', rootDir);

// Link the package in example
console.log('\n🔗 Linking package to example...');
executeCommand('npm link @yhattav/react-component-cursor', exampleDir);

console.log(
  '\n✅ Setup complete! You can now run npm run dev to start development'
);
