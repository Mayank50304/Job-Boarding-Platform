import SessionProviderWrapper from "./SessionProviderWrapper";  // Import the new wrapper

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <SessionProviderWrapper>
                    {children}
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
