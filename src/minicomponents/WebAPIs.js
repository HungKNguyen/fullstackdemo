import axios from "axios";

const instance = axios.create({
    baseURL: 'http://146.190.174.56/api/',
    headers: {
        'Content-Type': 'application/json'
    }
})

export function API_Countries(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("countries").then((response) => {
        async_callback(response.data)
    })
}

export function API_Regions(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("regions").then((response) => {
        async_callback(response.data)
    })
}

export function API_IncomeGroups(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("incomegroups").then((response) => {
        async_callback(response.data)
    })
}

export function API_Indicators(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("indicators").then((response) => {
        async_callback(response.data)
    })
}

export function API_Model(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("model").then((response) => {
        async_callback(response.data)
    })
}

export function API_Data(data, async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.post("data", data).then((response) => {
        async_callback(response.data)
    })
}

export function API_Regression(data, async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.post("regression", data).then((response) => {
        async_callback(response.data)
    })
}

export function API_Map_Data(async_callback, sync_callback = () => {}) {
    sync_callback()
    instance.get("map_data").then((response) => {
        async_callback(response.data)
    })
}

