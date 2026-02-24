import { execSync } from 'child_process';

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const pattern = /^(feature|bug|release|develop|test|issue|enhancement)\/[0-9]+-[a-z]+(?:_[a-z]+){0,3}$/;

if (!pattern.test(branch)) {
  console.error(`❌ Invalid branch name: ${branch}`);

  console.error('Example: feature/123-add_login');

  process.exit(1);
}

console.log(`✅ Branch valid: ${branch}`);
