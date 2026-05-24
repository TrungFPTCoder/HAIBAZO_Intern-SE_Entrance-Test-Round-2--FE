import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../store/slices/authorSlice";
import { Table, Button, Popconfirm, Space, Spin, Modal } from "antd";
import AuthorForm from "./AuthorForm";

export default function AuthorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, pagination } = useSelector((state) => state.authors);
  const [editingId, setEditingId] = useState(null);

  // Load list of authors when page or size changes
  useEffect(() => {
    dispatch(fetchAuthors({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    // API pagination is 0-indexed, Antd is 1-indexed
    dispatch(fetchAuthors({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteAuthor(id))
      .unwrap()
      .then(() => {
        // If deleted item was on the current page, reload
        dispatch(
          fetchAuthors({
            page: pagination.currentPage,
            size: pagination.pageSize,
          }),
        );
      });
  };

  // Antd Table columns specification
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => (
        <span className="font-semibold text-zinc-500">#{id}</span>
      ),
    },
    {
      title: "Author Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-semibold text-zinc-700">{name}</span>
      ),
    },
    {
      title: "Books Count",
      dataIndex: "booksCount",
      key: "booksCount",
      render: (count) => (
        <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-655">
          {count || 0} books
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="text-violet-650 hover:text-violet-750 font-semibold p-0 cursor-pointer"
            onClick={() => setEditingId(record.id)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete author"
            description="Are you sure you want to delete this author?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              className: "bg-red-500 text-white cursor-pointer",
            }}
          >
            <Button
              type="link"
              danger
              className="font-semibold p-0 cursor-pointer"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
            Author Management
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            View the list, add new, update information, and manage authors in
            the database.
          </p>
        </div>

        <button
          onClick={() => navigate("/authors/create")}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Add Author</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Loading data...">
          <Table
            columns={columns}
            dataSource={items.map((item) => ({ ...item, key: item.id }))}
            pagination={{
              current: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              total: pagination.totalElements,
              onChange: handleTableChange,
              showSizeChanger: false,
              className: "pt-4",
            }}
            scroll={{ x: "max-content" }}
            className="ant-table-custom"
          />
        </Spin>
      </div>

      {/* Edit Author Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-zinc-800">Edit Author</span>
        }
        open={editingId !== null}
        onCancel={() => setEditingId(null)}
        footer={null}
        destroyOnClose
        centered
        styles={{
          content: {
            borderRadius: "24px",
            padding: "24px",
          },
        }}
      >
        <AuthorForm
          id={editingId}
          onSuccess={() => {
            setEditingId(null);
            dispatch(
              fetchAuthors({
                page: pagination.currentPage,
                size: pagination.pageSize,
              }),
            );
          }}
          onCancel={() => setEditingId(null)}
        />
      </Modal>
    </div>
  );
}
