import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

const BreadcrumbNav = () => {
    const location = useLocation();
    const { id, vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intNumeroPractica } = useParams();
    
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const breadcrumbs = [];
        // Conditional paths
        if (path.includes('/mi-perfil')) {
            breadcrumbs.push({ path: '/mi-perfil', alias: 'Mi Perfil' });
        }

        if (path.includes('/recuperar-contrasena')) {
            breadcrumbs.push({ path: '/recuperar-contrasena', alias: 'Recuperar Contraseña' });
        }
        
        if (path.includes(`/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`)) {
            breadcrumbs.push({ path: `/materias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
        }
        if (path.includes(`/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}`)) {
            breadcrumbs.push({ path: `/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
            breadcrumbs.push({ path: `/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}`, alias: 'Detalle de la Actividad' });
        }
        if (path.includes(`/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}`)) {
            breadcrumbs.push({ path: `/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
            breadcrumbs.push({ path: `/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}`, alias: 'Detalle de la Actividad' });
            breadcrumbs.push({ path: `/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}`, alias: 'Detalle de la Practica' });
        }

        //Docentes
        if (path.includes(`/gruposMaterias/${vchClvMateria}/${intPeriodo}`)) {
            breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
        }
        if (path.includes(`/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`)) {
            breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
            breadcrumbs.push({ path: `/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
        }
        if (path.includes(`/gruposMaterias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}`)) {
            breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
            breadcrumbs.push({ path: `/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
        }
        
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className='container mx-auto pt-20 pb-6'>

        <Breadcrumb aria-label="Breadcrumb">
            <Breadcrumb.Item icon={HiHome}>
                <Link to="/">Inicio</Link>
            </Breadcrumb.Item>
            {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                    <Link to={breadcrumb.path}>{breadcrumb.alias}</Link>
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        </div>
    );
};

export default BreadcrumbNav;
