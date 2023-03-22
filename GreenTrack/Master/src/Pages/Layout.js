import React from 'react'
import { Outlet } from 'react-router-dom'

// 嵌套的二级路由
export default function layout() {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    )
}