import { supabase } from '../../supabaseClient'
//列表模块API
// 获取列表数据
export const FetchCount = async () => {
    try {
        const { data, error } = await supabase
            .from('account')
            .select('*')
        if (error) {
            throw error
        } else {
            return data.length > 0 ? data.length : 0
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
// 分页查询
export const FetchPage = async (start, end) => {
    try {
        const { data, error } = await supabase
            .from('account')
            .select('*')
            .order('created_at', { ascending: false })
            .range(start, end)
            .limit(10);
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
// 模糊查询
export const SearchText = async (query) => {
    try {
        const { data, error } = await supabase
            .from('account')
            .select('*').order('created_at', { ascending: false }).filter('address', 'ilike', `%${query.address ? query.address : ''}%`).filter('email', 'ilike', `%${query.email ? query.email : ''}%`).filter('user_name', 'ilike', `%${query.username ? query.username : ''}%`)
            .limit(10);
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//修改列表数据
export const UpdateAccount = async (update, id) => {
    try {
        const { error } = await supabase
            .from('account')
            .update(update)
            .eq('id', id)
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//添加数据
export const AddAccount = async (account) => {
    try {
        const { error } = await supabase
            .from('account')
            .insert(account)
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//删除数据
export const DeleteAccount = async (id) => {
    try {
        const { error } = await supabase
            .from('account')
            .delete()
            .eq('id', id);
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}