import ClientProfile from "./ClientProfile";

/**
 * ClientProfileModal
 * ───────────────────
 * Wrapper que exibe o ClientProfile dentro de um modal overlay.
 * Separado do ClientProfile para manter o componente de perfil reutilizável.
 */
export default function ClientProfileModal({ client, onSave, onDelete, onClose }) {
  return (
    <ClientProfile
      user={client}
      onSave={onSave}
      onDelete={onDelete}
      onClose={onClose}
    />
  );
}
