import React from "react";
import { useParams } from "react-router-dom";

const SamlAssertionPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = React.useState<{ saml_xml?: string; saml_raw?: string; relay?: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    fetch(`/saml-assertion/${id}`)
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 24 }}>Assertion not found.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ color: "#63b3ed" }}>SAML Assertion (debug)</h2>
      <p style={{ color: "#a0aec0" }}>Below is the raw decoded SAML assertion captured during the IdP response. This is for debugging only.</p>

      <div style={{ marginTop: 12, background: "#1a1e27", padding: 16, borderRadius: 8, color: "#e2e8f0", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {data.saml_xml}
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ed' }}>Open jwt.io</a>
        <span style={{ color: '#a0aec0', marginLeft: 8 }}>(jwt.io is for JWTs — to inspect SAML assertions consider <a href="https://www.samltool.com/decode.php" target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ed' }}>SAMLTool</a>)</span>
      </div>

      <div style={{ marginTop: 22 }}>
        <form method="post" action={`/saml-forward/${id}`}>
          <button type="submit" style={{ padding: '0.6rem 1rem', background: '#3182ce', color: '#fff', border: 'none', borderRadius: 8 }}>Continue to Auth0 (complete login)</button>
        </form>
      </div>
    </div>
  );
};

export default SamlAssertionPage;
