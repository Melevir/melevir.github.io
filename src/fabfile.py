from fabric.operations import local
from fabric.context_managers import lcd


def build():
    with lcd('school-pack.ru'):
        local('rm -rf .build/*')
        local('cactus build')
        local('rm -rf ../../static/*')
        local('cp -r .build/* ../../')
