import React from 'react';

export default function GioHangTruot({ isOpen, onClose, cart, setCart, formatVND, onCheckout }) {
    if (!isOpen) return null;
    const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#111111] border-l border-white/10 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                            <h3 className="text-lg font-bold tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Giỏ Hàng Của Bạn</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="mt-6 space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                            {cart.length === 0 ? (
                                <p className="text-center text-xs text-[#9B9B9B] py-12">Giỏ hàng của bạn đang trống.</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 bg-[#1A1A1A] p-4 border border-white/5">
                                        <img src={item.img} alt={item.name} className="w-16 h-16 object-cover" />
                                        <div className="flex-1">
                                            <h4 className="text-xs font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</h4>
                                            <p className="text-xs text-[#D4AF37] mt-1">{formatVND(item.price)} x {item.qty}</p>
                                        </div>
                                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-400 text-xs hover:underline">Xóa</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs uppercase tracking-widest text-[#9B9B9B]">Tạm tính:</span>
                            <span className="text-lg font-bold text-[#D4AF37]">{formatVND(totalCartPrice)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={onCheckout}
                            disabled={cart.length === 0}
                            className="w-full py-4 bg-gradient-to-r from-[#E6C76A] via-[#D4AF37] to-[#996515] text-black font-bold text-xs uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            TIẾN HÀNH THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}