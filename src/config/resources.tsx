import { DashboardOutlined, ProjectOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resource: IResourceItem[] = [
    /* A resource in refine performs these actions:
     list -> get all records(read)
     show -> get only one record(read)
     create, edit, delete  -> creates, edits, deletes a record
     or clone */
     
     {
        name: 'dashboard',
        list: '/',
        meta: {
            label: 'Dashboard',
            icon: <DashboardOutlined />
        }
     },
     {
        name: 'companies',
        list: '/companies',
        show: '/companies/:id',
        create: '/companies/create',
        edit: '/companies/edit/:id',
        meta: {
            label: 'Companies',
            icon: <ShopOutlined />
        }
     },
     {
        name: 'tasks',
        list: '/tasks',
        create: '/tasks/new',
        edit: '/tasks/edit/:id',
        meta: {
            label: 'Tasks',
            icon: <ProjectOutlined />
        }
     },


]