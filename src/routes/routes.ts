import { ComponentType, LazyExoticComponent } from "react"
import deepClone from "lodash/cloneDeep"

export type RouteType = {
    name: string,
    key: string,
    breadcrumb?: boolean,
    children?: RouteType[],
    component?: LazyExoticComponent<ComponentType<any>>
}

export const routes: RouteType[] = [
    {
        name: "example",
        key: "example",
        children: [
            {
                name: "example.example0",
                key: "example/examplePage0"
            }
        ]
    }
]

const useRoutes = () => {
    // 暂时返回一个新的路由表
    return deepClone(routes)
}