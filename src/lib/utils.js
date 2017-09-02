async function asyncSome(arr, func)
{
    for(i in arr)
    {
        let result = await func(arr[i])
        if(result)
            break
    }
}
function partial(func, ...args)
{
    return function(...rest)
    {
        func.call(this, ...args, ...rest)
    }
}
module.exports = 
{
    asyncSome,
    partial
}