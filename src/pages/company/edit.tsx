import { useForm, useSelect } from '@refinedev/antd'
import { Row, Col, Form, Select, Input, InputNumber } from 'antd'
import {Edit } from '@refinedev/antd'
import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutation'
import CustomAvatar from '@/components/custom-avatar'
import { getNameInitials } from '@/utilities'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { UsersSelectQuery } from '@/graphql/types'
import { companySizeOptions, industryOptions, businessTypeOptions } from '@/constants'
import { CompanyContactsTable } from './contacts-table'

const EditPage = () => {

  const { saveButtonProps, formProps, formLoading, queryResult } = useForm({
    redirect: false,
    meta:{
        gqlMutation: UPDATE_COMPANY_MUTATION,
    }
  });

  console.log(queryResult);

  const {avatarUrl, name} = queryResult?.data?.data || {}

  const {selectProps, queryResult : queryResultUsers} = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users',
    optionLabel: "name",
    pagination: {
      mode: 'off'
    },
    meta:{
      gqlQuery: USERS_SELECT_QUERY
    }
  });

  return (
    <div>
        <Row gutter={[32, 32]} >
            <Col xs={24} xl={12} >
              <Edit
                isLoading={formLoading}
                saveButtonProps={saveButtonProps}
                breadcrumb={false}
              >
                <Form {...formProps} layout='vertical' >
                   <CustomAvatar shape='square' src={avatarUrl} name={getNameInitials(name || "")} 
                        style={{width: 96, height: 96, marginBottom: '24px'}} />
                   <Form.Item
                      label= "Sales Owner"
                      name= "salesOwnerId"
                      initialValue={formProps?.initialValues?.salesOwner?.id}
                    >
                      <Select placeholder="Please select a sales owner" 
                        {...selectProps}
                        options={
                            queryResultUsers.data?.data?.map((user) => ({
                              value: user.id,
                              label: (
                                <SelectOptionWithAvatar 
                                  name={user.name}
                                  avatarUrl={user.avatarUrl?? undefined}
                                />
                              )
                            })) ?? []
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label= "Company Size"
                      name= "companySize"
                      initialValue={formProps?.initialValues?.salesOwner?.id}
                    >
                      <Select placeholder="Please select a company size" 
                        {...selectProps}
                        options={companySizeOptions}
                      />
                    </Form.Item>

                    <Form.Item label= "Total Revenue" name="totalRevenue" >
                      <InputNumber
                       autoFocus
                       addonBefore= '$'
                       min={0}
                       placeholder='0.00'
                      />
                    </Form.Item>

                    <Form.Item label="Industry" name="industry" >
                      <Select options={industryOptions} />
                    </Form.Item>

                    <Form.Item label="Business Type" name="businessType" >
                      <Select options={businessTypeOptions} />
                    </Form.Item>

                    <Form.Item label="Country" name="country" >
                      <Input placeholder="Country" />
                    </Form.Item>

                    <Form.Item label="Website" name="website" >
                      <Input placeholder="Website" />
                    </Form.Item>

                </Form>
              </Edit>
            </Col>
            <Col xs={24} xl={12} >
              <CompanyContactsTable />
            </Col>
        </Row>
    </div>
  )
}

export default EditPage