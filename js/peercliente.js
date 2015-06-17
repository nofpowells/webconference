// Compatibilidade dos browsers
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var mediaOptions = { audio: true, video: true};
var tamanhoVideo = "width:280px";
var tamanhoVideo1 = "width:auto";

// Objeto peer.
var peer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443, key: 'peerjs', debug: 3, allow_discovery: true});

var userList = [];
// Busca todos os ids criados no servidor.
peer.listAllPeers(function(list){
    for(var i = 0;i < list.length;i++)
    {
        userList.push(list[i]);
    }
});

peer.on('open', function(){
  $('#meu-id').append("SEU ID: " + peer.id);
});

// recebendo chamada
peer.on('call', function(call){
  // responde a chamada automaticamente
  call.answer(window.localStream);
  CriarChamada(call);
});

peer.on('error', function(err){
  alert(err.message);
});

// Funções de click - Botões
$(function(){
    
    
    $('#chamar').click(function(){
    // Inicia Chamada
    var call;
    if(userList.length == 0){
        call = peer.call($('#chamar-id').val(), window.localStream);
        CriarChamada(call);
    }else
    {
        for(var i = 0;i < userList.length;i++){
			call = peer.call(userList[i].toString(), window.localStream);
            CriarChamada(call);
		}         
    }   
   
  });
  //Finaliza chamada
  $('#desligar-chamada').click(function(){
      window.existingCall.close();
  });

  // Inicia o processo da chamada
  detectaMedias();
});

function detectaMedias() 
{
  // captura o video e o audio
  navigator.getUserMedia(mediaOptions, function(stream)
  {
    // Aqui você insere o local da sua cam.
    $('#video-deireito').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
  },function(){ $('#erro').show(); });
};

function CriarChamada(call) 
{  
  // Se ja existe uma chamada, adiciona na barra lateral direita dos participantes
  if (window.existingCall) 
  {
    call.on('stream', function(remoteStream){
      $('#participantes').append("<video id='" + call.peer + "'style='" + tamanhoVideo + "' autoplay></video><p>'"+call.peer+"'</p>");
      $('#' + call.peer).prop('src', URL.createObjectURL(remoteStream));
    });
    
  }
  else
  {
      // Se for o primeiro a entrar é direcionado para o centro da tela
    call.on('stream', function(stream){
      $('#video-principal').append("<video id='" + call.peer + "'style='" + tamanhoVideo1 + "' autoplay></video><p>'"+call.peer+"'</p>");
      $('#' + call.peer).prop('src', URL.createObjectURL(stream));
    });     

  }
  
  // UI stuff
  window.existingCall = call;
}