import React from 'react';
import { Head, Link } from '@inertiajs/react';

const policies = [
  {
    id: 'return-policy',
    number: '01',
    title: 'Chính sách đổi trả',
    intro: 'Để mỗi giao dịch được rõ ràng và an tâm, vui lòng kiểm tra sản phẩm ngay khi nhận.',
    details: [
      'Giữ lại hóa đơn, phụ kiện và bao bì đi kèm để shop có thể hỗ trợ kiểm tra đơn hàng.',
      'Nếu sản phẩm giao không đúng đơn hoặc có dấu hiệu hư hỏng khi vận chuyển, hãy lưu lại hình ảnh/video lúc mở hộp và liên hệ shop sớm nhất có thể.',
      'Điều kiện và thời hạn đổi trả cụ thể được xác nhận theo tình trạng sản phẩm và thông tin trên đơn hàng; sản phẩm đặt làm riêng được xử lý theo thỏa thuận khi đặt.',
    ],
  },
  {
    id: 'shipping-policy',
    number: '02',
    title: 'Chính sách giao hàng',
    intro: 'Nhạc cụ được kiểm tra và đóng gói cẩn thận trước khi bàn giao cho đơn vị vận chuyển.',
    details: [
      'Thời gian giao hàng và phí vận chuyển phụ thuộc vào địa chỉ nhận, phương thức giao hàng và sẽ được thông báo khi xác nhận đơn.',
      'Khi nhận hàng, vui lòng kiểm tra tình trạng kiện hàng và đối chiếu sản phẩm với đơn đặt trước khi ký nhận.',
      'Nếu kiện hàng có dấu hiệu móp, rách hoặc sản phẩm bị ảnh hưởng trong quá trình vận chuyển, hãy chụp ảnh/video và báo shop để được hướng dẫn.',
    ],
  },
  {
    id: 'warranty-policy',
    number: '03',
    title: 'Chính sách bảo hành',
    intro: 'Mỗi nhạc cụ có đặc tính và điều kiện bảo hành riêng theo thương hiệu, dòng sản phẩm.',
    details: [
      'Thời hạn, hạng mục và phạm vi bảo hành được ghi trên thông tin sản phẩm, phiếu bảo hành hoặc chứng từ mua hàng.',
      'Vui lòng cung cấp hóa đơn hoặc thông tin đơn hàng khi yêu cầu hỗ trợ để shop kiểm tra chính xác.',
      'Hư hỏng do va đập, bảo quản không phù hợp, tự ý sửa đổi hoặc hao mòn tự nhiên có thể không thuộc phạm vi bảo hành; shop sẽ trao đổi phương án sau khi kiểm tra.',
    ],
  },
];

export default function About() {
  return (
    <>
      <Head title="Về chúng tôi">
        <meta name="description" content="Tìm hiểu P-Guitar và các chính sách đổi trả, giao hàng, bảo hành dành cho khách hàng." />
      </Head>

      <div className="min-h-screen bg-[#0B0B0B] font-['Inter',sans-serif] text-[#F4F0E8] antialiased">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0B]/90 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="P-Guitar - Trang chủ">
              <span className="flex h-10 w-10 items-center justify-center border border-[#D4AF37]/50 font-serif text-xl text-[#D4AF37]">P</span>
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#D4AF37]">P-GUITAR</span>
            </Link>
            <nav className="flex items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.14em] sm:gap-8 sm:text-xs">
              <Link href="/" className="text-[#B8B1A2] transition hover:text-[#D4AF37]">Trang chủ</Link>
              <Link href="/#store" className="text-[#B8B1A2] transition hover:text-[#D4AF37]">Cửa hàng</Link>
              <a href="#store-story" className="hidden text-[#D4AF37] sm:inline">Về chúng tôi</a>
            </nav>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-24 text-center sm:px-8 sm:pb-28 sm:pt-32">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_58%)]" />
            <div className="relative mx-auto max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37] sm:text-xs">P-Guitar · The art of sound</p>
              <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-normal leading-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Âm thanh làm nên <span className="italic text-[#D4AF37]">câu chuyện.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#9B9B9B] sm:text-base">
                P-Guitar dành cho những người xem cây đàn không chỉ là nhạc cụ, mà còn là người bạn đồng hành trên hành trình âm nhạc.
              </p>
              <a href="#store-story" className="mt-9 inline-flex border border-[#D4AF37]/60 px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
                Khám phá P-Guitar
              </a>
            </div>
          </section>

          <section id="store-story" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Câu chuyện của chúng tôi</p>
                <h2 className="mt-4 text-3xl font-normal leading-tight sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Chọn đúng cây đàn. Bắt đầu đúng hành trình.
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-7 text-[#B8B1A2] sm:text-base">
                <p>
                  P-Guitar là không gian dành cho người yêu guitar, từ những bạn mới bắt đầu đến người chơi đã tìm thấy âm thanh riêng. Chúng tôi mong muốn giúp bạn khám phá và lựa chọn nhạc cụ phù hợp với phong cách, nhu cầu và ngân sách của mình.
                </p>
                <p>
                  Mỗi sản phẩm được giới thiệu cùng thông tin cần thiết để bạn dễ tìm hiểu trước khi quyết định. Nếu cần tư vấn về chất liệu, cảm giác chơi hay lựa chọn nhạc cụ, hãy liên hệ shop qua kênh hỗ trợ đã xác nhận trên đơn hàng.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-7xl gap-4 sm:grid-cols-3">
              {[
                ['Tuyển chọn', 'Thông tin sản phẩm rõ ràng, hỗ trợ bạn cân nhắc cây đàn phù hợp.'],
                ['Đồng hành', 'Tư vấn lựa chọn nhạc cụ theo nhu cầu và trải nghiệm chơi của bạn.'],
                ['Chăm sóc', 'Hướng dẫn hỗ trợ sau mua theo điều kiện của từng sản phẩm.'],
              ].map(([title, description], index) => (
                <article key={title} className="border border-white/10 bg-[#111111] p-6 sm:p-8">
                  <span className="text-xs tracking-[0.2em] text-[#D4AF37]">0{index + 1}</span>
                  <h3 className="mt-4 text-xl text-[#F4F0E8]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#9B9B9B]">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="store" className="scroll-mt-24 border-y border-white/10 bg-[#111111] px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Mua sắm an tâm</p>
                <h2 className="mt-3 text-3xl font-normal sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>Thông tin dành cho bạn</h2>
                <p className="mt-3 text-sm leading-6 text-[#9B9B9B]">
                  Tìm hiểu các nguyên tắc hỗ trợ trước khi đặt hàng. Thời hạn và điều kiện cụ thể được xác nhận theo sản phẩm và chứng từ mua hàng.
                </p>
              </div>

              <nav aria-label="Danh mục chính sách" className="flex flex-wrap gap-3">
                {policies.map((policy) => (
                  <a key={policy.id} href={`#${policy.id}`} className="border border-white/15 px-4 py-3 text-xs text-[#B8B1A2] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
                    {policy.title} <span className="ml-2 text-[#D4AF37]" aria-hidden="true">↗</span>
                  </a>
                ))}
              </nav>
            </div>
          </section>

          <div className="mx-auto max-w-7xl divide-y divide-white/10 px-5 sm:px-8">
            {policies.map((policy) => (
              <section key={policy.id} id={policy.id} className="scroll-mt-24 py-12 sm:py-16">
                <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
                  <div>
                    <p className="text-xs tracking-[0.25em] text-[#D4AF37]">{policy.number} / P-GUITAR</p>
                    <h2 className="mt-3 text-2xl font-normal sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>{policy.title}</h2>
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-[#B8B1A2]">{policy.intro}</p>
                    <ul className="mt-5 space-y-3">
                      {policy.details.map((detail) => (
                        <li key={detail} className="flex gap-3 text-sm leading-6 text-[#9B9B9B]">
                          <span className="mt-0.5 text-[#D4AF37]" aria-hidden="true">✦</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>

        <footer className="border-t border-white/10 bg-[#111111] px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="font-serif text-sm font-bold tracking-[0.2em] text-[#D4AF37]">P-GUITAR</Link>
            <nav aria-label="Liên kết chính sách" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#9B9B9B]">
              {policies.map((policy) => (
                <a key={policy.id} href={`#${policy.id}`} className="transition hover:text-[#D4AF37]">{policy.title}</a>
              ))}
            </nav>
            <p className="text-xs text-[#777]">© {new Date().getFullYear()} P-Guitar</p>
          </div>
        </footer>
      </div>
    </>
  );
}
