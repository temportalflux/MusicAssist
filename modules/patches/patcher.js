
export function overrideFunc(proto, methodName, functor)
{
	(function(super_method)
	{
		proto[methodName] = function()
		{
			functor.call(this, super_method, ...arguments);
		};
	})(proto[methodName]);
}

export function findFormGroup(html, type, isGroup)
{
	var foundQueriesOfType = [];
	html.find(type).each(function(i, htmlOfType)
	{
		if (isGroup(htmlOfType))
		{
			foundQueriesOfType.push($(this));
		}
	});
	return foundQueriesOfType.length == 1 ? foundQueriesOfType[0] : foundQueriesOfType;
}

export function htmlOnChange(html, queryString, callback)
{
	const query = html.find(queryString);
	if (query.length > 0)
	{
		query.on("change", callback);
	}
}

export function htmlEvent(html, queryString, evt, callback)
{
	const query = html.find(queryString);
	if (query.length > 0)
	{
		query.on(evt, callback);
	}
}
