import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockService {
  employees = [
    { id:'1', empCode:'EMP-001', firstName:'Ali', lastName:'Hassan', gender:'M', department:'Production', designation:'Senior Operator', employmentType:'full_time', joiningDate:'2021-03-15', baseSalary:45000, status:'active', phone:'0300-1234567', email:'ali@erp.com' },
    { id:'2', empCode:'EMP-002', firstName:'Sara', lastName:'Khan', gender:'F', department:'HR', designation:'HR Manager', employmentType:'full_time', joiningDate:'2019-07-01', baseSalary:75000, status:'active', phone:'0301-2345678', email:'sara@erp.com' },
    { id:'3', empCode:'EMP-003', firstName:'Ahmed', lastName:'Raza', gender:'M', department:'Production', designation:'Machine Operator', employmentType:'full_time', joiningDate:'2022-01-10', baseSalary:35000, status:'active', phone:'0302-3456789', email:'ahmed@erp.com' },
    { id:'4', empCode:'EMP-004', firstName:'Fatima', lastName:'Malik', gender:'F', department:'Finance', designation:'Accountant', employmentType:'full_time', joiningDate:'2020-11-20', baseSalary:60000, status:'active', phone:'0303-4567890', email:'fatima@erp.com' },
    { id:'5', empCode:'EMP-005', firstName:'Usman', lastName:'Sheikh', gender:'M', department:'Production', designation:'Digitizer', employmentType:'contract', joiningDate:'2023-06-01', baseSalary:55000, status:'active', phone:'0304-5678901', email:'usman@erp.com' },
    { id:'6', empCode:'EMP-006', firstName:'Zara', lastName:'Baig', gender:'F', department:'QC', designation:'QC Inspector', employmentType:'full_time', joiningDate:'2021-09-15', baseSalary:40000, status:'inactive', phone:'0305-6789012', email:'zara@erp.com' },
  ];

  attendance = [
    { id:'1', empCode:'EMP-001', employeeName:'Ali Hassan', date:'2025-03-14', checkIn:'08:00', checkOut:'17:15', status:'present', overtimeHrs:0.25, source:'biometric' },
    { id:'2', empCode:'EMP-002', employeeName:'Sara Khan', date:'2025-03-14', checkIn:'09:05', checkOut:'18:00', status:'late', overtimeHrs:0, source:'biometric' },
    { id:'3', empCode:'EMP-003', employeeName:'Ahmed Raza', date:'2025-03-14', checkIn:'', checkOut:'', status:'absent', overtimeHrs:0, source:'manual' },
    { id:'4', empCode:'EMP-004', employeeName:'Fatima Malik', date:'2025-03-14', checkIn:'08:45', checkOut:'17:30', status:'present', overtimeHrs:0, source:'biometric' },
    { id:'5', empCode:'EMP-005', employeeName:'Usman Sheikh', date:'2025-03-14', checkIn:'08:00', checkOut:'20:00', status:'present', overtimeHrs:3, source:'mobile' },
  ];

  leaves = [
    { id:'1', empCode:'EMP-001', employeeName:'Ali Hassan', leaveType:'annual', fromDate:'2025-03-20', toDate:'2025-03-22', daysCount:3, reason:'Family function', status:'pending', appliedOn:'2025-03-14' },
    { id:'2', empCode:'EMP-003', employeeName:'Ahmed Raza', leaveType:'sick', fromDate:'2025-03-15', toDate:'2025-03-15', daysCount:1, reason:'Fever', status:'approved', appliedOn:'2025-03-15' },
    { id:'3', empCode:'EMP-006', employeeName:'Zara Baig', leaveType:'annual', fromDate:'2025-03-25', toDate:'2025-03-28', daysCount:4, reason:'Vacation', status:'rejected', appliedOn:'2025-03-10' },
  ];

  machines = [
    { id:'1', machineCode:'EMB-001', name:'Tajima TMEF-H1504', type:'embroidery', brand:'Tajima', heads:15, needlesPerHead:15, purchaseDate:'2020-01-15', warrantyExpiry:'2023-01-15', status:'active', location:'Floor A', totalRunHours:4250, lastMaintenance:'2025-02-10' },
    { id:'2', machineCode:'EMB-002', name:'Brother PR1050X', type:'embroidery', brand:'Brother', heads:10, needlesPerHead:15, purchaseDate:'2021-06-20', warrantyExpiry:'2024-06-20', status:'active', location:'Floor A', totalRunHours:3100, lastMaintenance:'2025-01-25' },
    { id:'3', machineCode:'EMB-003', name:'Barudan BEXT-S1501C', type:'embroidery', brand:'Barudan', heads:15, needlesPerHead:15, purchaseDate:'2019-08-10', warrantyExpiry:'2022-08-10', status:'maintenance', location:'Floor B', totalRunHours:7800, lastMaintenance:'2025-03-10' },
    { id:'4', machineCode:'CUT-001', name:'Gerber Cutter GX7000', type:'cutting', brand:'Gerber', heads:1, needlesPerHead:0, purchaseDate:'2022-03-01', warrantyExpiry:'2025-03-01', status:'active', location:'Floor C', totalRunHours:1200, lastMaintenance:'2025-02-28' },
    { id:'5', machineCode:'EMB-004', name:'ZSK Sprint6', type:'embroidery', brand:'ZSK', heads:6, needlesPerHead:15, purchaseDate:'2018-11-15', warrantyExpiry:'2021-11-15', status:'idle', location:'Floor B', totalRunHours:9200, lastMaintenance:'2025-01-10' },
  ];

  stockItems = [
    { id:'1', sku:'THR-RED-321', name:'DMC Red Thread 321', category:'thread', colorCode:'DMC-321', unit:'cone', currentStock:12, reorderLevel:50, unitCost:850, status:'active' },
    { id:'2', sku:'THR-BLK-310', name:'DMC Black Thread 310', category:'thread', colorCode:'DMC-310', unit:'cone', currentStock:85, reorderLevel:50, unitCost:850, status:'active' },
    { id:'3', sku:'FAB-STB-80G', name:'Stabilizer 80g 50cm', category:'fabric', colorCode:'', unit:'roll', currentStock:3, reorderLevel:20, unitCost:1200, status:'active' },
    { id:'4', sku:'ACC-NDL-7511', name:'Needle 75/11 Sharp', category:'spare_part', colorCode:'', unit:'piece', currentStock:8, reorderLevel:50, unitCost:120, status:'active' },
    { id:'5', sku:'THR-WHT-BOB', name:'Bobbin Thread White', category:'thread', colorCode:'WHITE', unit:'cone', currentStock:5, reorderLevel:30, unitCost:650, status:'active' },
    { id:'6', sku:'THR-GLD-783', name:'Metallic Gold 783', category:'thread', colorCode:'DMC-783', unit:'cone', currentStock:45, reorderLevel:20, unitCost:1100, status:'active' },
  ];

  workOrders = [
    { id:'1', woNumber:'WO-2025-001', customer:'Al-Noor Uniforms', orderDate:'2025-03-01', deliveryDate:'2025-03-20', totalQty:500, unitPrice:150, totalAmount:75000, status:'in_production', design:'LOGO-SC-001' },
    { id:'2', woNumber:'WO-2025-002', customer:'Royal Sports Club', orderDate:'2025-03-05', deliveryDate:'2025-03-18', totalQty:200, unitPrice:200, totalAmount:40000, status:'qc', design:'FH-MONOGRAM-V2' },
    { id:'3', woNumber:'WO-2025-003', customer:'Crescent School', orderDate:'2025-02-28', deliveryDate:'2025-03-15', totalQty:1000, unitPrice:120, totalAmount:120000, status:'completed', design:'TK-PATCH-003' },
    { id:'4', woNumber:'WO-2025-004', customer:'Galaxy Corp', orderDate:'2025-03-08', deliveryDate:'2025-03-25', totalQty:300, unitPrice:180, totalAmount:54000, status:'confirmed', design:'EM-CHEST-005' },
    { id:'5', woNumber:'WO-2025-005', customer:'Hafeez & Sons', orderDate:'2025-03-10', deliveryDate:'2025-03-30', totalQty:750, unitPrice:140, totalAmount:105000, status:'draft', design:'NW-CAP-002' },
  ];

  quotations = [
    { id:'1', quoteNumber:'QUO-2025-001', customer:'Al-Noor Uniforms', design:'Logo-SC-V3', stitchCount:12500, quantity:500, unitPrice:150, totalAmount:75000, validUntil:'2025-03-30', status:'accepted' },
    { id:'2', quoteNumber:'QUO-2025-002', customer:'Royal Sports Club', design:'FH-Monogram', stitchCount:8200, quantity:200, unitPrice:200, totalAmount:40000, validUntil:'2025-04-05', status:'sent' },
    { id:'3', quoteNumber:'QUO-2025-003', customer:'Crescent School', design:'TK-Patch-V1', stitchCount:5500, quantity:1000, unitPrice:120, totalAmount:120000, validUntil:'2025-03-20', status:'draft' },
  ];

  vendors = [
    { id:'1', code:'VND-001', name:'Al-Noor Trading', contactPerson:'Mahmood Ahmed', phone:'021-1234567', email:'info@alnoor.com', paymentTerms:30, currency:'PKR', status:'active', outstanding:85000 },
    { id:'2', code:'VND-002', name:'Karachi Thread House', contactPerson:'Shakeel Baig', phone:'021-2345678', email:'sales@kth.com', paymentTerms:15, currency:'PKR', status:'active', outstanding:42000 },
    { id:'3', code:'VND-003', name:'Import Solutions LLC', contactPerson:'David Chen', phone:'+1-555-0100', email:'orders@importsol.com', paymentTerms:45, currency:'USD', status:'active', outstanding:12500 },
  ];

  customers = [
    { id:'1', code:'CUST-001', name:'Al-Noor Uniforms', contactPerson:'Imran Akhtar', phone:'021-9876543', email:'orders@alnooruniforms.com', paymentTerms:30, creditLimit:500000, outstanding:125000, status:'active' },
    { id:'2', code:'CUST-002', name:'Royal Sports Club', contactPerson:'Sana Mirza', phone:'042-8765432', email:'purchase@royalsports.pk', paymentTerms:15, creditLimit:200000, outstanding:40000, status:'active' },
    { id:'3', code:'CUST-003', name:'Crescent School', contactPerson:'Tariq Hussain', phone:'021-7654321', email:'admin@crescent.edu.pk', paymentTerms:45, creditLimit:1000000, outstanding:320000, status:'active' },
    { id:'4', code:'CUST-004', name:'Galaxy Corp', contactPerson:'Lisa Park', phone:'+1-555-0200', email:'lisa@galaxycorp.com', paymentTerms:30, creditLimit:300000, outstanding:54000, status:'active' },
  ];

  departments = [
    { id:'1', code:'PROD', name:'Production', manager:'Ali Hassan', costCentre:'CC-001', headcount:45, status:'active' },
    { id:'2', code:'HR', name:'Human Resources', manager:'Sara Khan', costCentre:'CC-002', headcount:5, status:'active' },
    { id:'3', code:'FIN', name:'Finance', manager:'Fatima Malik', costCentre:'CC-003', headcount:8, status:'active' },
    { id:'4', code:'QC', name:'Quality Control', manager:'Zara Baig', costCentre:'CC-004', headcount:12, status:'active' },
  ];
}
