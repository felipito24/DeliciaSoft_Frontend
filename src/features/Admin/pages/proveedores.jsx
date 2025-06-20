import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import '../adminStyles.css';
import Modal from '../components/modal';
import SearchBar from '../components/SearchBar';
import Notification from '../components/Notification';

export default function ProveedoresTable() {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [notification, setNotification] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  // Form state
  const [tipoProveedor, setTipoProveedor] = useState('Natural');
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [documentoONit, setDocumentoONit] = useState('');

  useEffect(() => {
    const mockProveedores = [
      { id: 1, tipo: 'Natural', nombre: 'Juan Pérez', contacto: '123456789', correo: 'juan@gmail.com', direccion: 'Av. Siempre Viva 123', estado: true, extra: '987654321' },
      { id: 2, tipo: 'Jurídico', nombre: 'Distribuidora ABC S.A.', contacto: '111222333', correo: 'contacto@abcsa.com', direccion: 'Calle Comercio 456', estado: true, extra: 'J12345678' }
    ];
    setProveedores(mockProveedores);
  }, []);

  const toggleEstado = (proveedor) => {
    const updated = proveedores.map(p =>
      p.id === proveedor.id ? { ...p, estado: !p.estado } : p
    );
    setProveedores(updated);
    showNotification(`Proveedor ${proveedor.estado ? 'desactivado' : 'activado'} exitosamente`);
  };

  const showNotification = (mensaje, tipo = 'success') => {
    setNotification({ visible: true, mensaje, tipo });
  };

  const hideNotification = () => {
    setNotification({ visible: false, mensaje: '', tipo: 'success' });
  };

  const abrirModal = (tipo, proveedor = null) => {
    setModalTipo(tipo);
    setProveedorSeleccionado(proveedor);
    if (tipo === 'editar' || tipo === 'visualizar') {
      setTipoProveedor(proveedor.tipo);
      setNombre(proveedor.nombre);
      setContacto(proveedor.contacto);
      setCorreo(proveedor.correo);
      setDireccion(proveedor.direccion);
      setDocumentoONit(proveedor.extra);
    } else if (tipo === 'agregar') {
      setTipoProveedor('Natural');
      setNombre('');
      setContacto('');
      setCorreo('');
      setDireccion('');
      setDocumentoONit('');
    }
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProveedorSeleccionado(null);
    setModalTipo(null);
  };

  const validarCampos = () => {
    if (!nombre.trim() || !contacto.trim() || !correo.trim() || !direccion.trim() || !documentoONit.trim()) {
      showNotification('Todos los campos son obligatorios', 'error');
      return false;
    }
    if (!correo.includes('@')) {
      showNotification('Correo no valido', 'error');
      return false;
    }

      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      showNotification('Correo no válido', 'error');
      return false;
    }

    if (modalTipo === 'agregar') {
    const yaExiste = proveedores.some(p => p.correo === correo || p.nombre.toLowerCase() === nombre.toLowerCase());
    if (yaExiste) {
      showNotification('Ya existe un proveedor con ese nombre o correo', 'error');
      return false;
    }
  }

    if (!/^\d+$/.test(contacto)) {
      showNotification('El contacto no es valido', 'error');
      return false;
    }
    if (contacto.length > 10) {
    showNotification('El campo "Contacto" no puede tener más de 10 dígitos', 'error');
    return false;
    }

    if (direccion.trim().length < 5) {
    showNotification('La dirección debe tener al menos 5 caracteres', 'error');
    return false;
    }


    if (contacto.length < 10) {
  showNotification('El campo "Contacto" no puede tener menos de 10 dígitos', 'error');
  return false;
    }
    if (documentoONit.length > 10) {
      showNotification(`${tipoProveedor === 'Natural' ? 'Documento' : 'NIT'} no puede tener más de 10 dígitos`, 'error');
      return false;
    }

    if (documentoONit.length < 10) {
      showNotification(`${tipoProveedor === 'Natural' ? 'Documento' : 'NIT'} no puede tener menos de 10 dígitos`, 'error');
      return false;
    }

    if (!/^\d+$/.test(documentoONit)) {
      showNotification(`${tipoProveedor === 'Natural' ? 'Documento' : 'NIT'} debe contener solo números`, 'error');
      return false;
    }
    if (nombre.trim().length < 3) {
      showNotification('El nombre debe tener al menos 3 caracteres', 'error');
      return false;
    }
    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
      showNotification('El nombre solo puede contener letras y espacios', 'error');
      return false;
    }


    return true;
  };

  const guardarProveedor = () => {
    if (!validarCampos()) return;

    if (modalTipo === 'agregar') {
      const nuevoId = proveedores.length ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
      setProveedores([...proveedores, {
        id: nuevoId,
        tipo: tipoProveedor,
        nombre,
        contacto,
        correo,
        direccion,
        estado: true,
        extra: documentoONit
      }]);
      showNotification('Proveedor agregado exitosamente');
    } else if (modalTipo === 'editar') {
      const updated = proveedores.map(p =>
        p.id === proveedorSeleccionado.id
          ? { ...p, tipo: tipoProveedor, nombre, contacto, correo, direccion, extra: documentoONit }
          : p
      );
      setProveedores(updated);
      showNotification('Proveedor actualizado exitosamente');
    }

    cerrarModal();
  };

  const confirmarEliminar = () => {
    setProveedores(proveedores.filter(p => p.id !== proveedorSeleccionado.id));
    showNotification('Proveedor eliminado exitosamente');
    cerrarModal();
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <Notification
        visible={notification.visible}
        mensaje={notification.mensaje}
        tipo={notification.tipo}
        onClose={hideNotification}
      />

      <div className="admin-toolbar">
        <button className="admin-button pink" onClick={() => abrirModal('agregar')}>+ Agregar</button>
        <SearchBar placeholder="Buscar proveedor..." value={filtro} onChange={setFiltro} />
      </div>

      <h2 className="admin-section-title">Proveedores</h2>
      <DataTable value={proveedoresFiltrados} className="admin-table" paginator rows={5}>
        <Column header="N°" headerStyle={{ paddingLeft: '1rem' }} body={(rowData, { rowIndex }) => rowIndex + 1} style={{ width: '3rem', textAlign: 'center' }} />
        <Column field="nombre" header="Nombre" headerStyle={{ paddingLeft: '3rem' }}/>
        <Column field="tipo" header="Tipo Proveedor" />
        <Column field="contacto" header="Contacto" />
        <Column field="correo" header="Correo" headerStyle={{ paddingLeft: '3rem' }}/>
        <Column field="direccion" header="Dirección" headerStyle={{ paddingLeft: '2rem' }}/>
        <Column
          header="Estado"
          body={(rowData) => (
            <InputSwitch checked={rowData.estado} onChange={() => toggleEstado(rowData)} />
          )}
        />
        <Column
          header="Acciones" 
          headerStyle={{ paddingLeft: '2rem' }}
          body={(rowData) => (
            <>
              <button className="admin-button gray" title="Visualizar" onClick={() => abrirModal('visualizar', rowData)}>🔍</button>
              <button className="admin-button yellow" onClick={() => abrirModal('editar', rowData)}>✏️</button>
              <button className="admin-button red" onClick={() => abrirModal('eliminar', rowData)}>🗑️</button>
            </>
          )}
        />
      </DataTable>

      {(modalTipo === 'agregar' || modalTipo === 'editar') && (
        <Modal visible={modalVisible} onClose={cerrarModal}>
          <h2 className="modal-title">{modalTipo === 'agregar' ? 'Agregar Proveedor' : 'Editar Proveedor'}</h2>
          <div className="modal-body modal-proveedor">
            <label>Tipo*
              <select value={tipoProveedor} onChange={(e) => setTipoProveedor(e.target.value)} className="modal-input">
                <option value="Natural">Natural</option>
                <option value="Jurídico">Jurídico</option>
              </select>
            </label>
            <label>Nombre*
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="modal-input" />
            </label>
            <label>Contacto:
              <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} className="modal-input" />
            </label>
            <label>Correo*
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="modal-input" />
            </label>
            <label>Dirección:
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="modal-input" />
            </label>
            <label>{tipoProveedor === 'Natural' ? 'Documento*' : 'NIT*'}
              <input type="text" value={documentoONit} onChange={(e) => setDocumentoONit(e.target.value)} className="modal-input" />
            </label>
          </div>

          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn save-btn" onClick={guardarProveedor}>Guardar</button>
          </div>
        </Modal>
      )}

      {modalTipo === 'visualizar' && proveedorSeleccionado && (
        <Modal visible={modalVisible} onClose={cerrarModal}>
          <h2 className="modal-title">Detalles del Proveedor</h2>
          <div className="modal-body">
            <p><strong>Tipo:</strong> {proveedorSeleccionado.tipo}</p>
            <p><strong>Nombre:</strong> {proveedorSeleccionado.nombre}</p>
            <p><strong>Contacto:</strong> {proveedorSeleccionado.contacto}</p>
            <p><strong>Correo:</strong> {proveedorSeleccionado.correo}</p>
            <p><strong>Dirección:</strong> {proveedorSeleccionado.direccion}</p>
            <p><strong>{proveedorSeleccionado.tipo === 'Natural' ? 'Documento' : 'NIT'}:</strong> {proveedorSeleccionado.extra}</p>
            <p><strong>Estado:</strong> {proveedorSeleccionado.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={cerrarModal}>Cerrar</button>
          </div>
        </Modal>
      )}

      {modalTipo === 'eliminar' && proveedorSeleccionado && (
        <Modal visible={modalVisible} onClose={cerrarModal}>
          <h2 className="modal-title">Confirmar Eliminación</h2>
          <div className="modal-body">
            <p>¿Seguro que quieres eliminar al proveedor <strong>{proveedorSeleccionado.nombre}</strong>?</p>
          </div>
          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn save-btn" onClick={confirmarEliminar}>Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
