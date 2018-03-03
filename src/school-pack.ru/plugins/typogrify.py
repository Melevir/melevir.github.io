from django import template
from typogrify.templatetags import typogrify_tags


def preBuild(_):
    register = template.Library()
    register.filter('typogrify', typogrify_tags.make_safe(typogrify_tags.typogrify))
    template.base.builtins.append(register)
