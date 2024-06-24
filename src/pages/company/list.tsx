import React from "react";
import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";
import { SearchOutlined } from "@ant-design/icons";
import {
  CreateButton,
  EditButton,
  DeleteButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { HttpError, getDefaultFilter, useGo } from "@refinedev/core";
import { Input, Space, Table } from "antd";

type SimpleCompany = Pick<Company, 'id' | 'name' | 'avatarUrl' | 'totalRevenue'> & {
  dealsAggregate: Array<{ sum?: { value?: number } }>;
};

export const CompanyList: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const go = useGo();
  const { tableProps, filters } = useTable<
    SimpleCompany,
    HttpError,
    SimpleCompany
  >({
    resource: "companies",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: "",
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return (
    <div>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() => {
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      >
        <Table {...tableProps} pagination={{ ...tableProps.pagination }}>
          <Table.Column<SimpleCompany>
            key="name"
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar shape="square" name={record.name} src={record.avatarUrl} />
                <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column<SimpleCompany>
            dataIndex="totalRevenue"
            title="Open Deals Amount"
            render={(value, company) => (
              <Text>
                {currencyNumber(company.dealsAggregate?.[0]?.sum?.value || 0)}
              </Text>
            )}
          />
          <Table.Column<SimpleCompany>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
