import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { CustomerService } from "../../services/CustomerService";

export default function Users() {
  let emptyUser = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    country: { name: "" },
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    first_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    last_name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    address: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) =>
      setUsers(getCustomers(data))
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };

  const formatDate = (value) => {
    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
        <h4 className="m-0">Customers</h4>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: "24px" }}
        />

        <span>{rowData.country.name}</span>
        <span>{rowData.country.code}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);

    if (
      user.first_name.trim() &&
      user.last_name.trim() &&
      user.address.trim() &&
      user.email.trim()
    ) {
      let _users = [...users];
      let _user = { ...user };
      console.log(_user);

      if (user.id) {
        const index = _users.findIndex((u) => u.id === user.id);
        _users[index] = _user;
        //updateUser({ body: _user, id: user.id });  // Assuming updateUser is an API call or similar function

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Updated",
          life: 3000,
        });
      } else {
        _user.id = createId(); // Assuming createId generates a unique identifier for a new user
        console.log("New user", _user);
        _users.push(_user);
        //addUser({ body: _user }); // Assuming addUser is an API call or similar function

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Created",
          life: 3000,
        });
      }
      setUsers(_users);
      setUserDialog(false);
      setUser(emptyUser);
    }
  };
  const deleteUser = () => {
    let _users = users.filter((val) => val.id !== user.id);
    setUsers(_users);

    setSelectedUsers(selectedUsers.filter((val) => val.id !== user.id));

    //deleteUser({ id: selectedUser.id }); to add later after splice
    setDeleteUserDialog(false);

    setUser(emptyUser);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "User Deleted",
      life: 3000,
    });
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };

    _user[`${name}`] = val;

    setUser(_user);
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteUser}
      />
    </React.Fragment>
  );

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editUser(rowData)}
          style={{
            color: "blue",
            backgroundColor: "transparent",
            borderColor: "blue",
            marginRight: "8px",
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
          style={{
            color: "red",
            backgroundColor: "transparent",
            borderColor: "red",
          }}
        />
      </React.Fragment>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <Toast ref={toast} />
      <DataTable
        value={users}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selection={selectedUsers}
        onSelectionChange={(e) => setSelectedUsers(e.value)}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "first_name",
          "last_name",
          "country.name",
          "address",
          "date",
          "email",
        ]}
        emptyMessage="No customers found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="id" header="id" sortable />
        <Column
          field="first_name"
          header="first Name"
          sortable
          filter
          filterPlaceholder="Search by first name"
        />
        <Column
          field="last_name"
          header="last Name"
          sortable
          filter
          filterPlaceholder="Search by last name"
        />
        <Column
          field="country.name"
          header="Country"
          sortable
          filterField="country.name"
          body={countryBodyTemplate}
          filter
          filterPlaceholder="Search by country"
        />
        <Column
          field="address"
          header="address"
          sortable
          filter
          filterPlaceholder="Search by address"
        />
        <Column
          field="email"
          header="email"
          sortable
          filterField="date"
          dataType="date"
          filter
        />
        <Column
          field="date"
          header="inscription date"
          sortable
          filterField="date"
          dataType="date"
          body={dateBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          headerStyle={{ width: "10rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>

      <Dialog
        visible={userDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="User Details"
        modal
        className="p-fluid"
        footer={userDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="id" className="font-bold">
            id
          </label>
          <InputText id="id" value={user.id} readOnly />
        </div>
        <div className="field">
          <label htmlFor="firstName" className="font-bold">
            First Name
          </label>
          <InputText
            id="firstName"
            value={user.first_name}
            onChange={(e) => onInputChange(e, "first_name")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !user.first_name,
            })}
          />
          {submitted && !user.first_name && (
            <small className="p-error">First name is required.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="lastName" className="font-bold">
            Last Name
          </label>
          <InputText
            id="lastName"
            value={user.last_name}
            onChange={(e) => onInputChange(e, "last_name")}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <InputText
            id="email"
            value={user.email}
            onChange={(e) => onInputChange(e, "email")}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="address" className="font-bold">
            Address
          </label>
          <InputText
            id="address"
            value={user.address}
            onChange={(e) => onInputChange(e, "address")}
          />
        </div>

        <div className="field">
          <label htmlFor="country" className="font-bold">
            Country
          </label>
          <InputText id="country" value={user.country.name} readOnly />
        </div>
      </Dialog>

      <Dialog
        visible={deleteUserDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>
              Are you sure you want to delete{" "}
              <b>{[user.id, user.first_name, user.last_name]}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
