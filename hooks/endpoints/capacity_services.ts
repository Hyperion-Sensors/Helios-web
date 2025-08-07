import helios_server from ".";

export async function get_recent_capacity(asset_id: number, limit: number) {
    const response = await helios_server.get(`caps/recent-capacity`, {
        timeout: 1500,
        params: {
            asset_id: asset_id,
            limit: limit,
        },
    });
    return response;
}

export async function get_recent_load(asset_id: number, limit: number) {
    const response = await helios_server.get(`caps/recent-load`, {
        timeout: 1500,
        params: {
            asset_id: asset_id,
            limit: limit,
        },
    });
    return response;
}