"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_BASE;
  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Memoize fetchCustomers with useCallback
  const fetchCustomers = useCallback(async () => {
    const data = await fetch(`${APIBASE}/customer`);
    const customers = await data.json();
    setCustomerList(customers);
  }, [APIBASE]);

  const startEdit = (customer) => async () => {
    setEditMode(true);
    customer.dateOfBirth = new Date(customer.dateOfBirth).toISOString().split("T")[0];
    reset(customer);
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerFormSubmit = (data) => {
    data.dateOfBirth = new Date(data.dateOfBirth).toISOString();

    if (editMode) {
      fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
        setEditMode(false);
        fetchCustomers();
      });
      return;
    }

    fetch(`${APIBASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
      fetchCustomers();
    });
  };

  return (
    <main>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
            <div className="grid grid-cols-2 gap-4 w-fit m-4">
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Date of Birth:</div>
              <div>
                <input
                  name="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <input
                  name="memberNumber"
                  type="number"
                  {...register("memberNumber", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Interests:</div>
              <div>
                <input
                  name="interests"
                  type="text"
                  {...register("interests", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="col-span-2 text-right">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Customers ({customerList.length})</h1>
          <ul>
            {customerList.map((customer) => (
              <li key={customer._id}>
                <button className="border border-black p-1/2" onClick={startEdit(customer)}>
                  📝
                </button>{" "}
                <button className="border border-black p-1/2" onClick={deleteById(customer._id)}>
                  ❌
                </button>{" "}
                <Link href={`/customer/${customer._id}`}>{customer.name}</Link> -{" "}
                {customer.interests}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
