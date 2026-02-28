

# Thêm Đăng nhập Email/Password cho melodiQ

## Database

### 1. Tạo bảng `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

### 2. Trigger tự tạo profile khi đăng ký
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Code Changes

### 3. Tạo `src/integrations/supabase/client.ts`
- Khởi tạo Supabase client với URL và anon key từ Cloud.

### 4. Tạo `src/contexts/AuthContext.tsx`
- Quản lý state: `user`, `profile`, `loading`.
- `onAuthStateChange` listener + `getSession`.
- Cung cấp `signIn`, `signUp`, `signOut`, `updateProfile`.

### 5. Tạo `src/pages/AuthPage.tsx`
- Form đăng nhập / đăng ký với toggle giữa 2 mode.
- Input: email, password, display name (khi đăng ký).
- Style phù hợp theme đỏ-đen của melodiQ.

### 6. Tạo `src/pages/ResetPasswordPage.tsx`
- Form quên mật khẩu + trang đặt lại mật khẩu (`/reset-password`).

### 7. Cập nhật `src/pages/ProfilePage.tsx`
- Khi chưa đăng nhập: hiển thị nút chuyển đến AuthPage.
- Khi đã đăng nhập: hiển thị thông tin profile, nút đăng xuất, chỉnh sửa tên hiển thị.

### 8. Cập nhật `src/pages/Index.tsx`
- Thêm route `/auth` và `/reset-password`.
- Wrap `AuthProvider` quanh toàn bộ app.

### 9. Cập nhật `src/App.tsx`
- Đảm bảo `AuthProvider` bọc ngoài cùng (trong BrowserRouter).

