import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookDetail, clearCurrentBook } from "../../store/slices/bookSlice";
import { fetchReviews, createReview } from "../../store/slices/reviewSlice";
import { Spin, Pagination } from "antd";
import { AlertTriangle, ChevronRight, Star } from "lucide-react";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBook, detailLoading } = useSelector((state) => state.books);
  const { items: allReviews, loading: reviewsLoading, pagination: reviewsPagination } = useSelector((state) => state.reviews);

  // Local state for the review textarea
  const [comment, setComment] = useState("");
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  // Reset page when book ID changes
  useEffect(() => {
    setCurrentReviewPage(1);
  }, [id]);

  // 1. Fetch book detail - only on mount or when ID changes
  useEffect(() => {
    dispatch(fetchBookDetail(id));

    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id]);

  // 2. Fetch reviews - runs when ID or page changes
  useEffect(() => {
    dispatch(fetchReviews({ bookId: id, page: currentReviewPage - 1, size: 10 }));
  }, [dispatch, id, currentReviewPage]);

  // Filter reviews written for this specific book
  const bookReviews = allReviews;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    dispatch(
      createReview({
        review: comment,
        bookId: Number(id),
      })
    ).then(() => {
      setComment("");
      if (currentReviewPage === 1) {
        dispatch(fetchReviews({ bookId: id, page: 0, size: 10 }));
      } else {
        setCurrentReviewPage(1);
      }
    });
  };

  if (detailLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin sách..." />
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="rounded-full bg-red-50 p-6 text-red-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-800">Không tìm thấy sách</h2>
          <p className="text-zinc-500">Cuốn sách bạn yêu cầu không tồn tại hoặc đã bị gỡ bỏ.</p>
        </div>
        <button
          onClick={() => navigate("/books")}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold px-6 py-3 transition-all duration-200 cursor-pointer shadow-md shadow-violet-500/20"
        >
          Quay lại Danh Sách Sách
        </button>
      </div>
    );
  }

  // Gradients list for book cover
  const bookGradients = [
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-700",
    "from-emerald-400 to-teal-600",
    "from-indigo-500 to-purple-650",
    "from-slate-600 to-zinc-800",
  ];
  const bGradient = bookGradients[currentBook.id % bookGradients.length];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb navigation */}
      <nav className="flex text-sm font-medium text-zinc-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/books" className="hover:text-violet-600 transition-colors">Sách</Link>
          </li>
          <li className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-800 line-clamp-1">{currentBook.name}</span>
          </li>
        </ol>
      </nav>

      {/* Book Detail card */}
      <div className="grid gap-8 md:grid-cols-3 bg-white rounded-3xl p-6 md:p-8 border border-zinc-150/80 shadow-sm">
        {/* Book Cover Container */}
        <div className="md:col-span-1">
          <div className={`aspect-3/4 w-full rounded-2xl bg-linear-to-br ${bGradient} p-8 flex flex-col justify-between text-white shadow-md relative overflow-hidden group`}>
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-all duration-500"></div>
            
            <div className="flex justify-between items-start">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm uppercase">
                ID: #{currentBook.id}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                {currentBook.name}
              </h2>
              <p className="text-sm text-white/80">
                Nhà xuất bản hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Book Info Container */}
        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight">
              {currentBook.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="text-zinc-400">Tác giả:</span>
              <Link
                to={`/authors/${currentBook.authorId}`}
                className="text-violet-600 hover:underline font-bold text-base"
              >
                {currentBook.authorName}
              </Link>
              <span className="h-4 w-px bg-zinc-200"></span>
              
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-zinc-800">Hoạt động</span>
                <span className="text-zinc-400">({reviewsPagination.totalElements || 0} đánh giá)</span>
              </div>
            </div>

            <hr className="border-zinc-150" />

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-800">Tóm tắt tác phẩm</h3>
              <p className="text-zinc-650 leading-relaxed font-light">
                Cuốn sách "{currentBook.name}" được sáng tác bởi tác giả tài hoa {currentBook.authorName}. Đây là một trong những cuốn sách nổi bật được nhiều độc giả yêu thích, bàn luận sôi nổi trên thư viện của chúng tôi. Hãy đọc thử và đóng góp ý kiến của riêng bạn dưới phần review!
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <a href="#reviews-section" className="flex-1 md:flex-initial text-center rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-bold px-6 py-3 transition-colors cursor-pointer shadow-md shadow-violet-500/10">
              Xem đánh giá ({reviewsPagination.totalElements || 0})
            </a>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div id="reviews-section" className="grid gap-8 lg:grid-cols-3">
        {/* Review list */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
            Đánh giá từ độc giả
          </h3>
          
          <Spin spinning={reviewsLoading} tip="Đang cập nhật đánh giá...">
            {bookReviews.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  {bookReviews.map((rev, index) => (
                    <div key={rev.id || index} className="bg-white border border-zinc-150/80 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                            R
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-800 text-sm">Độc giả ẩn danh</h4>
                            <span className="text-xs text-zinc-400">Mã đánh giá: #{rev.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500 gap-0.5">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-xs font-bold text-zinc-500">Độc giả khuyên đọc</span>
                        </div>
                      </div>
                      <p className="text-zinc-650 text-sm leading-relaxed font-light">
                        {rev.review}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-center pt-4">
                  <Pagination
                    current={currentReviewPage}
                    pageSize={reviewsPagination.pageSize || 10}
                    total={reviewsPagination.totalElements || 0}
                    onChange={(page) => setCurrentReviewPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-150/80 p-8 rounded-2xl text-center space-y-3">
                <p className="text-zinc-500">Chưa có đánh giá nào cho cuốn sách này.</p>
                <p className="text-xs text-zinc-400">Hãy là người đầu tiên viết cảm nhận!</p>
              </div>
            )}
          </Spin>
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-150/80 p-6 rounded-3xl shadow-sm space-y-5 sticky top-24">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-800">
                Viết đánh giá của bạn
              </h3>
              <p className="text-xs text-zinc-400">Chia sẻ cảm nhận chân thực để gửi trực tiếp lên Backend.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cảm nhận cuốn sách</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Cuốn sách có gì đặc sắc? Bạn tâm đắc nhất điều gì?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 outline-none transition-all focus:border-violet-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 transition-colors cursor-pointer text-sm shadow-md shadow-violet-500/20"
              >
                Gửi đánh giá
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
