async function asyncSome(arr, func)
{
    for(i in arr)
    {
        let result = await func(arr[i])
        if(result)
            break
    }
}

module.exports = 
{
    asyncSome
}