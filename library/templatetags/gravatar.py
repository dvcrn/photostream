from django import template
import md5

register = template.Library()

@register.filter(name='gravatarUrl', is_safe=True)
def thumburl(email):
	m = md5.new()
	m.update(email.lower())

	digest = m.hexdigest()

	url = "http://www.gravatar.com/avatar/%s.jpg?s=30&d=identicon" % digest
	return url