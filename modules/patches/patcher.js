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