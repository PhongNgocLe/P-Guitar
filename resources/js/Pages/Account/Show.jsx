import { Head, Link, usePage } from '@inertiajs/react';

const accountFields = [
    ['Tên đăng nhập', 'username'],
    ['Họ và tên', 'fullname'],
    ['Email', 'email'],
    ['Số điện thoại', 'phone'],
    ['Địa chỉ', 'address'],
    ['Vai trò', 'role'],
];

export default function ShowAccount() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-[#0B0B0B] px-6 py-12 text-[#F4F0E8]">
            <Head title="Thông tin tài khoản" />
            <main className="mx-auto max-w-3xl">
                <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F4F0E8]">
                    ← Về trang chủ
                </Link>
                <section className="mt-8 border border-white/10 bg-[#151515] p-6 sm:p-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Tài khoản P-Guitar</p>
                    <h1 className="mt-2 text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Thông tin tài khoản
                    </h1>
                    <dl className="mt-8 divide-y divide-white/10">
                        {accountFields.map(([label, field]) => (
                            <div key={field} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                                <dt className="text-xs uppercase tracking-wider text-[#9B9B9B]">{label}</dt>
                                <dd className="break-words text-sm">{user[field] || 'Chưa cập nhật'}</dd>
                            </div>
                        ))}
                    </dl>
                    
                        
                    
                    <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
                     {user?.role === 'user' && (
                        <Link href="/" className="border border-[#D4AF37]/60 px-5 py-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                            Tiếp tục mua sắm
                        </Link>
                     )}
                        {user?.role === 'admin' && (
                       
                            <Link href="/dashboard" className="border border-[#D4AF37]/60 px-5 py-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors">
                                Khu vực Quản trị viên (Dashboard)
                            </Link>
                        
                    )}
                    
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="border border-[#D4AF37]/60 px-5 py-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors">
                        
                            Đăng xuất
                        </Link>
                    </div>
                    
                </section>
            </main>
        </div>
    );
}
