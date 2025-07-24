export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
