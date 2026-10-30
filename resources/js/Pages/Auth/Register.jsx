import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        fullname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <Guest>
            <Head title="Đăng ký P-Guitar" />

            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <h1 className="mb-5 text-2xl text-[#F4F0E8]" style={{ fontFamily: "'Playfair Display', serif" }}>Tạo tài khoản</h1>
                <div>
                    <Label forInput="username" value="Tên đăng nhập" className="!text-[#B8B1A2]" />

                    <Input
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="username"
                        isFocused={true}
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="fullname" value="Họ và tên" className="!text-[#B8B1A2]" />
                    <Input
                        type="text"
                        name="fullname"
                        value={data.fullname}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="name"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="email" value="Email (không bắt buộc)" className="!text-[#B8B1A2]" />

                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="username"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value="Mật khẩu" className="!text-[#B8B1A2]" />

                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password_confirmation" value="Xác nhận mật khẩu" className="!text-[#B8B1A2]" />

                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full !rounded-none !border-white/15 !bg-[#0B0B0B] !text-[#F4F0E8] focus:!border-[#D4AF37] focus:!ring-[#D4AF37]/20"
                        handleChange={onHandleChange}
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href={route('login')} className="text-xs text-[#B8B1A2] underline decoration-white/20 underline-offset-4 hover:text-[#D4AF37]">
                        Đã có tài khoản?
                    </Link>

                    <Button className="ml-4 !rounded-none !bg-[#D4AF37] !text-black hover:!bg-[#E6C76A]" processing={processing}>
                        Đăng ký
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
