import Guest from '@/Layouts/Guest';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('login'));
    };

    const handleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    return (
        <Guest>
            <Head title="Đăng nhập P-Guitar" />

            <h1 className="mb-5 text-2xl text-[#F4F0E8]" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng nhập</h1>
            {status && <div className="mb-4 text-sm font-medium text-[#D4AF37]">{status}</div>}
            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <div>
                    <Label forInput="username" value="Tên đăng nhập" className="!text-[#B8B1A2]" />
                    <Input
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="username"
                        isFocused
                        required
                        handleChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value="Mật khẩu" className="!text-[#B8B1A2]" />
                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="current-password"
                        required
                        handleChange={handleChange}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Link href={route('register')} className="text-xs text-[#B8B1A2] underline decoration-white/20 underline-offset-4 hover:text-[#D4AF37]">
                        Tạo tài khoản
                    </Link>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-xs text-[#B8B1A2] underline decoration-white/20 underline-offset-4 hover:text-[#D4AF37]">
                            Quên mật khẩu?
                        </Link>
                    )}
                    <Button className="ml-4 !rounded-none !bg-[#D4AF37] !text-black hover:!bg-[#E6C76A]" processing={processing}>
                        Đăng nhập
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
