#!/bin/bash
GIT_USERNAME="patternfly-build"
GH_REPO=${GITHUB_REPOSITORY}
REPO="github.com/${GH_REPO}"
echo "Preparing release environment..."
git config user.email "patternfly-build@redhat.com"
git config user.name ${GIT_USERNAME}
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# Lerna is complicated. Commands: https://github.com/lerna/lerna/tree/master/commands
# Identify packages that have been updated since the previous tagged release
# Update their versions and changelogs according to angular commit guidelines
# https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit

if [[ ! -z "${CORE_VERSION}" ]]; then
  echo "Updating to @patternfly/patternfly: ${CORE_VERSION}"
  npm pkg set dependencies.@patternfly/patternfly=${CORE_VERSION} --workspace @patternfly/react-core --workspace @patternfly/react-docs --workspace @patternfly/react-icons --workspace @patternfly/react-tokens --workspace @patternfly/react-styles
fi

# publish to npm
yarn run lerna publish --conventional-commits --conventional-graduate --no-private --dist-tag=latest --yes

# dry run
# yarn run lerna version --conventional-commits --conventional-graduate --no-private --yes --no-git-tag-version --no-push

# immediately after promote - set up repo for next prerelease
yarn run lerna version preminor --force-publish --conventional-commits --no-private --yes --preid prerelease
