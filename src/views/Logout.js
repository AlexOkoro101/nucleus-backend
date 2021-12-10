import React, { useEffect } from 'react'

function Logout() {
    useEffect(() => {
        logout()
        return () => {
            logout()
        }
    }, [])


    const logout = () => {
        window.localStorage.clear()
        window.location.reload()
    }
    return (
        <div>
            
        </div>
    )
}

export default Logout
