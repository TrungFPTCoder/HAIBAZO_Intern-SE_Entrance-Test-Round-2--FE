import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorDetail, clearCurrentAuthor } from "../../store/slices/authorSlice";
import { fetchBooks } from "../../store/slices/bookSlice";
import { Spin, Pagination } from "antd";
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function AuthorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAuthor, detailLoading } = useSelector((state) => state.authors);
  const { items: books, loading: booksLoading, pagination } = useSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when author ID changes
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  // 1. Fetch author detail - only on mount or when ID changes
  useEffect(() => {
    dispatch(fetchAuthorDetail(id));

    return () => {
      dispatch(clearCurrentAuthor());
    };
  }, [dispatch, id]);

  // 2. Fetch books - runs when ID or page changes
  useEffect(() => {
    dispatch(fetchBooks({ authorId: id, page: currentPage - 1, size: 10 }));
  }, [dispatch, id, currentPage]);

  // Filter books written by this author
  const authorBooks = books;

  if (detailLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spin size="large" tip="Đang tải tiểu sử tác giả..." />
      </div>
    );
  }

  if (!currentAuthor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="rounded-full bg-red-50 p-6 text-red-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-800">Không tìm thấy tác giả</h2>
          <p className="text-zinc-500">Tác giả bạn yêu cầu không tồn tại hoặc dữ liệu đã bị gỡ bỏ.</p>
        </div>
        <button
          onClick={() => navigate("/authors")}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold px-6 py-3 transition-all duration-200 cursor-pointer shadow-md shadow-violet-500/20"
        >
          Quay lại Danh Sách Tác Giả
        </button>
      </div>
    );
  }

  // Curated list of author avatar gradients to look highly premium
  const cardGradients = [
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
    "from-emerald-500 to-teal-700",
    "from-indigo-650 to-violet-750",
    "from-slate-600 to-zinc-800",
  ];
  const gradientIndex = currentAuthor.id % cardGradients.length;
  const gradient = cardGradients[gradientIndex];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex text-sm font-medium text-zinc-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/authors" className="hover:text-violet-600 transition-colors">Tác giả</Link>
          </li>
          <li className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-800">{currentAuthor.name}</span>
          </li>
        </ol>
      </nav>

      {/* Author Bio Banner */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Avatar Placeholder */}
        <div className="shrink-0 relative">
          <div className="absolute -inset-1.5 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 opacity-75 blur-sm"></div>
          <div className={`relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-linear-to-br ${gradient} border-4 border-white  shadow-md flex items-center justify-center text-white text-4xl font-black`}>
            {currentAuthor.name ? currentAuthor.name.charAt(0) : "A"}
          </div>
        </div>

        {/* Bio text */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {currentAuthor.name}
            </h1>
            <p className="text-sm font-semibold text-violet-600">
              Mã tác giả: #{currentAuthor.id}
            </p>
          </div>

          <hr className="border-zinc-150 max-w-sm mx-auto md:mx-0" />

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-800">Tiểu sử tác giả</h3>
            <p className="text-zinc-600 leading-relaxed font-light">
              Tác giả tài hoa đã cống hiến trọn vẹn trí tuệ và tâm hồn để kiến tạo nên những tác phẩm đặc sắc trong nền văn học. Hiện tại trong cơ sở dữ liệu hệ thống, tác giả đang có {currentAuthor.booksCount || 0} tác phẩm được lưu trữ.
            </p>
          </div>
        </div>
      </div>

      {/* Books list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Các tác phẩm của {currentAuthor.name} ({pagination.totalElements || 0})
        </h2>

        <Spin spinning={booksLoading} tip="Đang cập nhật danh sách sách...">
          {authorBooks.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {authorBooks.map((book) => {
                  // Curated list of gradient backgrounds for books
                  const bookGradients = [
                    "from-amber-500 to-orange-600",
                    "from-rose-500 to-red-700",
                    "from-emerald-400 to-teal-600",
                    "from-indigo-500 to-purple-600",
                    "from-slate-650 to-zinc-800",
                  ];
                  const bGradient = bookGradients[book.id % bookGradients.length];

                  return (
                    <div
                      key={book.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-150/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-violet-200 :border-violet-900/50"
                    >
                      <div>
                        <div className={`relative h-40 bg-linear-to-br ${bGradient} p-6 flex flex-col justify-between text-white overflow-hidden`}>
                          <span className="self-start rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                            ID: #{book.id}
                          </span>
                          <h3 className="text-lg font-bold tracking-tight line-clamp-2 leading-snug">
                            {book.name}
                          </h3>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                            <span>Đánh giá: {book.reviewsCount || 0} bài</span>
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                            Tác phẩm đặc sắc thuộc bản quyền sáng tác của {currentAuthor.name}. Click để chuyển sang trang xem chi tiết và các bài review đánh giá từ độc giả.
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-zinc-50">
                        <Link
                          to={`/books/${book.id}`}
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-100 hover:bg-violet-600 :bg-violet-600 text-zinc-700 hover:text-white :text-white py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                        >
                          <span>Chi Tiết Sách</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              <div className="flex justify-center pt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pagination.pageSize || 10}
                  total={pagination.totalElements || 0}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-150/80 p-8 rounded-2xl text-center text-zinc-500">
              Hiện chưa có tác phẩm nào của tác giả này trong hệ thống.
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
}
