const core = require('@actions/core');
const getBranchFromVersion = require('./src/getBranchFromVersion');

// Get compatible platform branch name

const { version } = require(`${process.env.GITHUB_WORKSPACE}/package.json`);

core.info(`Package version is ${version}`);

const overrideMajorVersion = core.getInput('override-major-version') || undefined;

const platformBranch = getBranchFromVersion(version, {
  overrideMajorVersion,
});

if (overrideMajorVersion) {
  core.info(`Compatible branch name with overridden major version is ${platformBranch}`);
} else {
  core.info(`Compatible branch name is ${platformBranch}`);
}

// Set test suite compatible branch

const overrideTestSuiteBranch = core.getInput('override-testsuite-branch') || undefined;

const testSuiteBranch = overrideTestSuiteBranch || platformBranch;

if (overrideTestSuiteBranch !== undefined) {
  core.info(`Test Suite branch overridden with ${overrideTestSuiteBranch}`);
} else {
  core.info(`Test Suite branch is ${testSuiteBranch}`);
}

core.setOutput('testsuite-branch', testSuiteBranch);

// Set dashmate compatible branch

const overrideDashmateBranch = core.getInput('override-dashmate-branch') || undefined;

const dashmateBranch = overrideDashmateBranch || platformBranch;

if (overrideDashmateBranch !== undefined) {
  core.info(`Dashmate branch overridden with ${overrideDashmateBranch}`);
} else {
  core.info(`Dashmate branch is ${dashmateBranch}`);
}

core.setOutput('dashmate-branch', dashmateBranch);

// Set current branch/tag name

let currentBranchName;
if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
  currentBranchName = process.env.GITHUB_HEAD_REF;
  core.info(`Current branch name is ${currentBranchName}`);
} else {
  let refType = 'tags';
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' || process.env.GITHUB_EVENT_NAME === 'schedule') {
     refType = 'heads';
  }
  currentBranchName = process.env.GITHUB_REF.substring(`refs/${refType}/`.length);
  core.info(`Current branch name is ${currentBranchName}`);
}

core.setOutput('current-branch', currentBranchName);
