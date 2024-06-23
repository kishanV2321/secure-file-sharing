export const asyncHandler = (requestHandler) => {
    return (req, res, next) => 
        Promise.resolve(requestHandler(req, res, next))
        .catch((err)=> next(err) )
}

//requestHandler is a fuction