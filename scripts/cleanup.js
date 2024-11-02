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

const rootDir = path.resolve(__dirname, '..');
const exampleDir = path.resolve(rootDir, 'example');

console.log('🧹 Cleaning up links...');

// Unlink from example
console.log('\n🔗 Unlinking package from example...');
executeCommand('npm unlink @yhattav/react-component-cursor', exampleDir);

// Unlink from global
console.log('\n🔗 Removing global link...');
executeCommand('npm unlink', rootDir);

console.log('\n✅ Cleanup complete!');
